// Simple Express backend for GolfSocial
// Features:
// - /api/auth/register and /api/auth/login (bcrypt + JWT)
// - /api/items CRUD (file-based storage)
// - /api/ai/handicap proxy (calls OpenAI if OPENAI_API_KEY set, otherwise simple heuristic)
// - /auth/google placeholder for SSO

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

async function readJson(file, fallback) {
  try {
    const s = await fs.readFile(file, 'utf8');
    return JSON.parse(s || '[]');
  } catch (e) {
    return fallback === undefined ? [] : fallback;
  }
}

async function writeJson(file, data){
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Auth: register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing' });

  const users = await readJson(USERS_FILE, []);
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), email, passwordHash: hash };
  users.push(user);
  await writeJson(USERS_FILE, users);
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Auth: login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing' });
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'invalid' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Middleware: optional auth
function authRequired(req, res, next){
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'no-token' });
  const parts = h.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'malformed' });
  const token = parts[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({ error: 'invalid' });
  }
}

// Items CRUD
app.get('/api/items', async (req, res) => {
  const items = await readJson(ITEMS_FILE, []);
  res.json(items);
});

app.post('/api/items', authRequired, async (req, res) => {
  const items = await readJson(ITEMS_FILE, []);
  const item = req.body;
  if (!item || !item.id) item.id = Date.now();
  item.owner = req.user.email;
  items.unshift(item);
  await writeJson(ITEMS_FILE, items);
  res.json(item);
});

app.put('/api/items/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const items = await readJson(ITEMS_FILE, []);
  const idx = items.findIndex(i=>i.id===id);
  if (idx === -1) return res.status(404).json({ error: 'not-found' });
  const updated = { ...items[idx], ...req.body };
  items[idx] = updated;
  await writeJson(ITEMS_FILE, items);
  res.json(updated);
});

app.delete('/api/items/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  let items = await readJson(ITEMS_FILE, []);
  items = items.filter(i=>i.id!==id);
  await writeJson(ITEMS_FILE, items);
  res.json({ ok: true });
});

// AI proxy for handicap calculation
app.post('/api/ai/handicap', async (req, res) => {
  const card = req.body || {};
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    // fallback heuristic
    const strokes = Number(card.strokes) || 0;
    const par = Number(card.par) || 72;
    const diff = strokes - par;
    const handicap = (diff > 0) ? (Math.round(diff * 1.2 * 10)/10).toFixed(1) : '0.0';
    return res.json({ handicap });
  }

  try{
    // Call OpenAI Chat Completions API
    const prompt = `You are a golf assistant. Given a single round with strokes ${card.strokes} and par ${card.par}, estimate the player's differential/handicap figure as a single decimal number. Return JSON only: { "handicap": "12.4" }`;
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant for golf handicaps.' }, { role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.2
    };
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    // try to parse JSON from assistant
    const txt = j?.choices?.[0]?.message?.content || '';
    // extract number
    const m = txt.match(/([0-9]+\.?[0-9]*)/);
    const handicap = m ? m[1] : '0.0';
    res.json({ handicap, raw: txt });
  }catch(e){
    console.error('AI proxy error', e);
    res.status(500).json({ error: 'ai-failed' });
  }
});

// SSO placeholder
app.get('/auth/google', (req, res) => {
  const client = process.env.GOOGLE_CLIENT_ID;
  if (!client) return res.send('Google SSO not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in env.');
  // In a real setup you'd redirect to passport/google flow.
  res.send('SSO flow would start here (not implemented in this starter).');
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
