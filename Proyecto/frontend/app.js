const { useState, useEffect, useRef } = React;

function useTranslations() {
  const [langs, setLangs] = useState({});
  const [lang, setLang] = useState(localStorage.getItem('lang') || (navigator.language.startsWith('es') ? 'es' : 'en'));

  useEffect(() => {
    Promise.all([
      fetch('./en.json').then(r => r.json()),
      fetch('./es.json').then(r => r.json())
    ]).then(([en, es]) => {
      setLangs({ en, es });
    }).catch(err => {
      console.error('i18n load error', err);
    });
  }, []);

  const t = (k) => {
    if (!langs.en) return k;
    return (langs[lang] && langs[lang][k]) || langs['en'][k] || k;
  }

  const switchLang = (l) => { setLang(l); localStorage.setItem('lang', l); }

  return { t, lang, switchLang };
}

function useTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return prefersDark;
  });

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

function App(){
  const { t, lang, switchLang } = useTranslations();
  const { dark, toggle } = useTheme();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ date:'', course:'', strokes:'', par:72, holes:18 });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  // On mount, try load items from backend, fallback to localStorage
  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems(){
    setLoading(true);
    try{
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('no-backend');
      const data = await res.json();
      setItems(data);
    }catch(e){
      console.warn('Backend not available, using localStorage fallback');
      const local = JSON.parse(localStorage.getItem('gs_cards') || '[]');
      setItems(local);
    } finally{ setLoading(false); }
  }

  async function saveItem(e){
    e && e.preventDefault();
    const card = { ...form, id: editingId || Date.now(), owner: user?.email || 'local' };
    // try backend
    try{
      const res = await fetch('/api/items' + (editingId?`/${editingId}`:''), {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(card)
      });
      if (!res.ok) throw new Error('no-backend');
      const saved = await res.json();
      // refresh from backend
      loadItems();
      setForm({ date:'', course:'', strokes:'', par:72, holes:18 });
      setEditingId(null);
      setMessage('Saved to server');
    }catch(e){
      // local fallback
      const cur = JSON.parse(localStorage.getItem('gs_cards')||'[]');
      if (editingId){
        const next = cur.map(c => c.id===editingId?{...c, ...card}:c);
        localStorage.setItem('gs_cards', JSON.stringify(next));
        setItems(next);
      } else {
        const next = [card, ...cur];
        localStorage.setItem('gs_cards', JSON.stringify(next));
        setItems(next);
      }
      setForm({ date:'', course:'', strokes:'', par:72, holes:18 });
      setEditingId(null);
      setMessage(t('error_network'));
    }
  }

  async function removeItem(id){
    try{
      const res = await fetch('/api/items/' + id, { method:'DELETE' });
      if (!res.ok) throw new Error('no-backend');
      await res.json();
      loadItems();
    }catch(e){
      const cur = JSON.parse(localStorage.getItem('gs_cards')||'[]');
      const next = cur.filter(c=>c.id!==id);
      localStorage.setItem('gs_cards', JSON.stringify(next));
      setItems(next);
      setMessage(t('error_network'));
    }
  }

  function startEdit(card){ setForm({ date:card.date, course:card.course, strokes:card.strokes, par:card.par, holes:card.holes }); setEditingId(card.id); }

  async function calculateHandicap(card){
    setMessage(t('loading'));
    try{
      const res = await fetch('/api/ai/handicap', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(card) });
      if (!res.ok) throw new Error('no-backend');
      const body = await res.json();
      // assume { handicap: '12.4' }
      const next = items.map(it => it.id===card.id?{...it, handicap: body.handicap}:it);
      setItems(next);
      setMessage('Handicap updated');
    }catch(e){
      // fallback simple heuristic: (strokes - par) average scaled
      const strokes = Number(card.strokes) || 0;
      const par = Number(card.par) || 72;
      const diff = strokes - par;
      const handicap = (diff > 0) ? (Math.round(diff * 1.2 * 10)/10).toFixed(1) : '0.0';
      const next = items.map(it => it.id===card.id?{...it, handicap}:it);
      setItems(next);
      setMessage(t('error_network'));
    }
  }

  // Auth functions (call backend or simulate)
  async function register(email, password){
    try{
      const res = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('no-backend');
      const body = await res.json();
      localStorage.setItem('token', body.token);
      setUser({ email });
      setMessage('Registered');
    }catch(e){
      // local naive storage (not secure) as fallback
      const users = JSON.parse(localStorage.getItem('gs_users')||'[]');
      if (users.find(u=>u.email===email)) { setMessage('User exists'); return; }
      users.push({ email, password });
      localStorage.setItem('gs_users', JSON.stringify(users));
      localStorage.setItem('token', 'local-token-'+Date.now());
      setUser({ email });
      setMessage('Registered (local)');
    }
  }

  async function login(email, password){
    try{
      const res = await fetch('/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('no-backend');
      const body = await res.json();
      localStorage.setItem('token', body.token);
      setUser({ email });
      setMessage('Welcome');
      loadItems();
    }catch(e){
      const users = JSON.parse(localStorage.getItem('gs_users')||'[]');
      const found = users.find(u=>u.email===email && u.password===password);
      if (found){ localStorage.setItem('token','local:'+email); setUser({ email }); setMessage('Welcome (local)'); loadItems(); }
      else setMessage('Invalid credentials or no backend');
    }
  }

  function logout(){ localStorage.removeItem('token'); setUser(null); setMessage(null); }

  function sso(){
    // Open placeholder route that the backend would handle with Passport/google
    window.location.href = '/auth/google';
  }

  // Simple form handlers
  function setField(k, v){ setForm(f => ({...f, [k]: v})); }

  return (
    <div>
      <div className="controls">
        <div className="form-card">
          <strong>{t('title')}</strong>
          <div style={{marginTop:8}}>
            <button onClick={() => switchLang('es')}>ES</button>
            <button onClick={() => switchLang('en')}>EN</button>
            <button className="btn-sso" onClick={sso}>{t('sso')}</button>
            <button onClick={toggle} style={{marginLeft:8}}>{dark? t('theme_dark') : t('theme_light')}</button>
          </div>
        </div>

        <div className="form-card" style={{minWidth:260}}>
          {user ? (
            <div>
              <div className="small">{t('profile')}: {user.email}</div>
              <div style={{marginTop:8}}>
                <button onClick={logout}>{t('logout')}</button>
              </div>
            </div>
          ) : (
            <AuthBox onLogin={login} onRegister={register} t={t} />
          )}
        </div>
      </div>

      <div className="form-card">
        <h3>{t('add_card')}</h3>
        <form onSubmit={saveItem}>
          <label>{t('date')}</label>
          <input className="input" type="date" value={form.date} onChange={e=>setField('date', e.target.value)} />

          <label>{t('course')}</label>
          <input className="input" placeholder="Club de golf" value={form.course} onChange={e=>setField('course', e.target.value)} />

          <label>{t('strokes')}</label>
          <input className="input" type="number" value={form.strokes} onChange={e=>setField('strokes', e.target.value)} />

          <label>{t('par')}</label>
          <input className="input" type="number" value={form.par} onChange={e=>setField('par', e.target.value)} />

          <div className="footer-actions">
            <button type="button" onClick={()=>{ setForm({ date:'', course:'', strokes:'', par:72, holes:18 }); setEditingId(null); }}>{t('cancel')}</button>
            <button className="primary" type="submit">{t('save')}</button>
          </div>
        </form>
      </div>

      <div className="grid">
        {loading ? <div className="card">{t('loading')}</div> : (
          items.length ? items.map(it=> (
            <div className="card" key={it.id}>
              <h3>{it.course || '—'}</h3>
              <div className="meta">{it.date} • {it.holes} {t('holes')}</div>
              <div style={{marginTop:8}}>
                <div><strong>{t('strokes')}:</strong> {it.strokes}</div>
                <div><strong>{t('par')}:</strong> {it.par}</div>
                <div><strong>{t('handicap')}:</strong> {it.handicap ?? '—'}</div>
              </div>
              <div className="footer-actions">
                <button onClick={()=>startEdit(it)}>{t('edit')}</button>
                <button onClick={()=>removeItem(it.id)}>{t('delete')}</button>
                <button className="primary" onClick={()=>calculateHandicap(it)}>{t('calculate_handicap')}</button>
              </div>
            </div>
          )) : <div className="card">{t('no_items')}</div>
        )}
      </div>

      {message && <div style={{position:'fixed',right:12,bottom:12,background:'var(--surface)',padding:12,borderRadius:8,boxShadow:'var(--card-shadow)'}}>{message}</div>}
    </div>
  );
}

function AuthBox({ onLogin, onRegister, t }){
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>setMode('login')} style={{fontWeight: mode==='login' ? '600' : '400'}}>{t('login')}</button>
        <button onClick={()=>setMode('register')} style={{fontWeight: mode==='register' ? '600' : '400'}}>{t('register')}</button>
      </div>
      <form onSubmit={e=>{ e.preventDefault(); mode==='login' ? onLogin(email,password) : onRegister(email,password); }}>
        <label>{t('email')}</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
        <label>{t('password')}</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="footer-actions">
          <button type="submit" className="primary">{mode==='login' ? t('login') : t('register')}</button>
        </div>
      </form>
    </div>
  );
}

// mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
