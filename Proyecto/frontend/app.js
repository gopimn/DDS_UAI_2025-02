const { useState, useEffect } = React;

function useTranslations() {
  const [langs, setLangs] = useState({});
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'es');

  useEffect(() => {
    Promise.all([
      fetch('./en.json').then(r => r.json()),
      fetch('./es.json').then(r => r.json())
    ]).then(([en, es]) => {
      setLangs({ en, es });
    }).catch(err => console.error('i18n error', err));
  }, []);

  const t = (k) => {
    if (!langs.en) return k;
    return (langs[lang] && langs[lang][k]) || langs['en'][k] || k;
  };

  return { t, lang, setLang: (l) => { setLang(l); localStorage.setItem('lang', l); } };
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

function Header({ user, logout, dark, toggle, t, lang, setLang, tab, setTab }) {
  return (
    <div className="app-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            {user.photo && <img src={user.photo} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
            <h1 style={{ margin: '0', fontSize: '24px' }}>⛳ GolfSocial</h1>
            <p className="small" style={{ margin: '5px 0 0 0' }}>{user.name || user.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={toggle} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>{dark ? '☀️' : '🌙'}</button>
          <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <button onClick={logout} style={{ background: 'var(--danger)', border: 'none', color: 'white', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px' }}>Salir</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', paddingLeft: '20px', borderBottom: '1px solid var(--border)' }}>
        {['feed', 'friends', 'search', 'profile'].map(t_name => (
          <button
            key={t_name}
            onClick={() => setTab(t_name)}
            style={{
              padding: '10px 20px',
              background: tab === t_name ? 'var(--accent)' : 'transparent',
              color: tab === t_name ? 'white' : 'var(--text)',
              border: 'none',
              cursor: 'pointer',
              borderBottom: tab === t_name ? '3px solid var(--accent)' : 'none'
            }}
          >
            {t_name === 'feed' ? '📱 Feed' : t_name === 'friends' ? '👥 Amigos' : t_name === 'search' ? '🔍 Descubrir' : '👤 Perfil'}
          </button>
        ))}
      </div>
    </div>
  );
}

function AuthPanel({ onLogin, onRegister, t, lang, setLang, dark, toggle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPhoto(event.target?.result || '');
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)', padding: '20px' }}>
      <div className="form-card" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>⛳ GolfSocial</h1>
          <p style={{ margin: '0', fontSize: '14px', color: 'var(--text)', opacity: 0.7 }}>Red Social para Golfistas</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button onClick={toggle} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>
              {dark ? '☀️' : '🌙'}
            </button>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ marginLeft: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <h2 style={{ marginBottom: '20px' }}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin && (
          <>
            <input
              className="input"
              type="text"
              placeholder="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input"
              type="date"
              placeholder="Fecha de Nacimiento"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <textarea
              className="input"
              placeholder="Biografía"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ minHeight: '80px', resize: 'vertical' }}
            ></textarea>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Foto de Perfil:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ width: '100%', padding: '8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)' }}
              />
              {photo && (
                <img src={photo} alt="preview" style={{ width: '80px', height: '80px', borderRadius: '50%', marginTop: '10px', objectFit: 'cover' }} />
              )}
            </div>
          </>
        )}

        <button
          className="primary"
          onClick={() => {
            if (isLogin) onLogin(email, password);
            else onRegister(email, password, name, birthDate, bio, photo);
          }}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          {isLogin ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const { t, lang, setLang } = useTranslations();
  const { dark, toggle } = useTheme();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ date: '', course: '', strokes: '', par: 72 });
  const [message, setMessage] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const API_BASE = 'http://localhost:5000';

  const getToken = () => localStorage.getItem('token');

  const headers = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    if (user) loadFeed();
  }, [user]);

  async function loadFeed() {
    try {
      const res = await fetch(`${API_BASE}/api/items`, { headers: headers() });
      if (!res.ok) throw new Error('no-feed');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.warn('Feed error:', e);
    }
  }

  async function loadFriends() {
    try {
      const res = await fetch(`${API_BASE}/api/friends`, { headers: headers() });
      if (!res.ok) throw new Error('no-friends');
      const data = await res.json();
      setFriends(data);
    } catch (e) {
      console.warn('Friends error:', e);
    }
  }

  async function register(email, password, name, birthDate, bio, photo) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password, name, birthDate, bio, photo })
      });
      if (!res.ok) throw new Error('register-failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMessage('¡Bienvenido a GolfSocial!');
    } catch (e) {
      setMessage('Error en registro');
      console.error(e);
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('login-failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMessage('¡Sesión iniciada!');
      loadFriends();
    } catch (e) {
      setMessage('Error: Email o contraseña incorrectos');
      console.error(e);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  async function saveCard(e) {
    e.preventDefault();
    if (!form.date || !form.course || !form.strokes) {
      setMessage('Fill all fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('save-failed');
      setForm({ date: '', course: '', strokes: '', par: 72 });
      setMessage('Card saved!');
      loadFeed();
    } catch (e) {
      setMessage('Error saving');
    }
  }

  async function deleteCard(id) {
    if (!confirm('Delete?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/items/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      if (!res.ok) throw new Error('delete-failed');
      setMessage('Deleted');
      loadFeed();
    } catch (e) {
      setMessage('Error');
    }
  }

  async function addFriend(friendId) {
    try {
      const res = await fetch(`${API_BASE}/api/friends/add`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ friendId })
      });
      if (!res.ok) throw new Error('add-failed');
      setMessage('Friend added!');
      loadFriends();
    } catch (e) {
      setMessage('Error');
    }
  }

  async function searchUsers(q) {
    if (q.length < 2) {
      setAllUsers([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/users/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('search-failed');
      const data = await res.json();
      setAllUsers(data);
    } catch (e) {
      console.warn('Search error:', e);
    }
  }

  async function updateProfile(name, birthDate, bio, photo) {
    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ name, birthDate, bio, photo })
      });
      if (!res.ok) throw new Error('update-failed');
      const data = await res.json();
      setUser({ ...user, name: data.name, birthDate: data.birthDate, bio: data.bio, photo: data.photo });
      setMessage('¡Perfil actualizado!');
    } catch (e) {
      setMessage('Error al actualizar perfil');
      console.error(e);
    }
  }

  if (!user) {
    return <AuthPanel onLogin={login} onRegister={register} t={t} lang={lang} setLang={setLang} dark={dark} toggle={toggle} />;
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Header user={user} logout={logout} dark={dark} toggle={toggle} t={t} lang={lang} setLang={setLang} tab={tab} setTab={setTab} />
      <div className="app-root">
        {message && <div className="toast">{message}</div>}

        {tab === 'feed' && (
          <div>
            <div className="form-card">
              <strong>{t('add_card')}</strong>
              <form onSubmit={saveCard}>
                <label>{t('date')}</label>
                <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <label>{t('course')}</label>
                <input className="input" placeholder="Golf Club" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
                <label>{t('strokes')}</label>
                <input className="input" type="number" value={form.strokes} onChange={(e) => setForm({ ...form, strokes: e.target.value })} />
                <label>{t('par')}</label>
                <input className="input" type="number" value={form.par} onChange={(e) => setForm({ ...form, par: e.target.value })} />
                <div className="footer-actions">
                  <button className="primary" type="submit">{t('save')}</button>
                </div>
              </form>
            </div>

            <h3>Feed</h3>
            <div className="grid">
              {items.length ? items.map(card => (
                <div key={card.id} className="card">
                  <h3>{card.course}</h3>
                  <div className="meta">{card.date} • {card.owner}</div>
                  <div className="stats">
                    <div className="stat-item">
                      <div className="stat-value">{card.strokes}</div>
                      <div className="stat-label">Strokes</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{card.par}</div>
                      <div className="stat-label">Par</div>
                    </div>
                  </div>
                  <div className="footer-actions">
                    {card.owner === user.email && (
                      <button onClick={() => deleteCard(card.id)}>{t('delete')}</button>
                    )}
                  </div>
                </div>
              )) : <p>{t('no_items')}</p>}
            </div>
          </div>
        )}

        {tab === 'friends' && (
          <div>
            <h2>Friends</h2>
            <div className="grid">
              {friends.length ? friends.map(f => (
                <div key={f.id} className="card">
                  <h3>{f.email}</h3>
                  <p className="small">Handicap: {f.handicap || 'N/A'}</p>
                </div>
              )) : <p>No friends</p>}
            </div>
          </div>
        )}

        {tab === 'search' && (
          <div>
            <h2>Discover Players</h2>
            <input className="input" placeholder="Search by email..." value={searchQ} onChange={(e) => { setSearchQ(e.target.value); searchUsers(e.target.value); }} style={{ marginBottom: 20 }} />
            <div className="grid">
              {allUsers.map(u => (
                <div key={u.id} className="card">
                  <h3>{u.email}</h3>
                  <p className="small">Handicap: {u.handicap || 'N/A'}</p>
                  <button onClick={() => addFriend(u.id)}>Add Friend</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ maxWidth: '600px' }}>
            <h2>Mi Perfil</h2>
            <div className="form-card">
              {user.photo && <img src={user.photo} alt="Perfil" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }} />}
              <div style={{ marginBottom: '15px' }}>
                <label>Foto de Perfil:</label>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => updateProfile(user.name, user.birthDate, user.bio, ev.target?.result || '');
                    reader.readAsDataURL(file);
                  }
                }} style={{ width: '100%', padding: '8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px' }} />
              </div>
              <input type="text" placeholder="Nombre" defaultValue={user.name} onBlur={(e) => updateProfile(e.target.value, user.birthDate, user.bio, user.photo)} style={{ marginBottom: '10px', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', width: '100%' }} />
              <input type="date" placeholder="Fecha de Nacimiento" defaultValue={user.birthDate || ''} onBlur={(e) => updateProfile(user.name, e.target.value, user.bio, user.photo)} style={{ marginBottom: '10px', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', width: '100%' }} />
              <textarea placeholder="Biografía" defaultValue={user.bio} onBlur={(e) => updateProfile(user.name, user.birthDate, e.target.value, user.photo)} style={{ marginBottom: '10px', padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', width: '100%', minHeight: '100px' }} />
              <div className="stat-item">
                <div className="stat-value">{user.handicap || 'N/A'}</div>
                <div className="stat-label">Handicap</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
