// GolfSocial Backend - Express API
// Complete implementation with auth, CRUD, friends, handicap calculation, and profiles

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
const PORT = process.env.PORT || 5000;

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

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// ============ AUTH ============

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, birthDate, bio, photo } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing' });

  const users = await readJson(USERS_FILE, []);
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'exists' });
  
  const hash = await bcrypt.hash(password, 10);
  const user = { 
    id: Date.now(), 
    email, 
    passwordHash: hash,
    name: name || 'Player',
    birthDate: birthDate || null,
    bio: bio || '',
    photo: photo || 'https://via.placeholder.com/150?text=No+Photo',
    handicap: null,
    friends: [],
    createdAt: new Date().toISOString()
  };
  users.push(user);
  await writeJson(USERS_FILE, users);
  
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email, name: user.name, bio: user.bio, photo: user.photo } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'missing' });
  
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'invalid' });
  
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  
  const token = jwt.sign({ sub: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email, name: user.name, bio: user.bio, photo: user.photo, handicap: user.handicap } });
});

// ============ AUTH MIDDLEWARE ============

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
    return res.status(401).json({ error: 'invalid-token' });
  }
}

// ============ USERS / PROFILES ============

app.get('/api/user/:id', async (req, res) => {
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'not-found' });
  
  // Get user's scorecards for handicap calculation
  const items = await readJson(ITEMS_FILE, []);
  const userCards = items.filter(i => i.owner === user.email && !i.private);
  
  res.json({
    id: user.id,
    email: user.email,
    handicap: user.handicap,
    cardsCount: userCards.length,
    createdAt: user.createdAt
  });
});

app.get('/api/user/me', authRequired, async (req, res) => {
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.id === Number(req.user.sub));
  if (!user) return res.status(404).json({ error: 'not-found' });
  
  res.json({
    id: user.id,
    email: user.email,
    handicap: user.handicap,
    friends: user.friends || []
  });
});

// ============ SCORECARDS / ITEMS ============

// GET all public scorecards (feed) + user's own + friends'
app.get('/api/items', authRequired, async (req, res) => {
  const items = await readJson(ITEMS_FILE, []);
  const users = await readJson(USERS_FILE, []);
  const currentUser = users.find(u => u.id === Number(req.user.sub));
  
  const friendIds = currentUser?.friends || [];
  const friendEmails = users
    .filter(u => friendIds.includes(u.id))
    .map(u => u.email);
  
  // Show: public items + own items + friends' items
  const visible = items.filter(i => 
    !i.private || 
    i.owner === req.user.email || 
    friendEmails.includes(i.owner)
  );
  
  res.json(visible);
});

// GET public feed (no auth needed)
app.get('/api/items/public', async (req, res) => {
  const items = await readJson(ITEMS_FILE, []);
  const publicItems = items.filter(i => !i.private);
  res.json(publicItems);
});

// POST create scorecard
app.post('/api/items', authRequired, async (req, res) => {
  const items = await readJson(ITEMS_FILE, []);
  const item = {
    ...req.body,
    id: Date.now(),
    owner: req.user.email,
    createdAt: new Date().toISOString()
  };
  
  items.unshift(item);
  await writeJson(ITEMS_FILE, items);
  
  // Recalculate user handicap
  await updateUserHandicap(req.user.email);
  
  res.json(item);
});

// PUT update scorecard (only owner can edit)
app.put('/api/items/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  const items = await readJson(ITEMS_FILE, []);
  const idx = items.findIndex(i => i.id === id);
  
  if (idx === -1) return res.status(404).json({ error: 'not-found' });
  if (items[idx].owner !== req.user.email) return res.status(403).json({ error: 'forbidden' });
  
  items[idx] = { ...items[idx], ...req.body, owner: req.user.email };
  await writeJson(ITEMS_FILE, items);
  
  // Recalculate user handicap
  await updateUserHandicap(req.user.email);
  
  res.json(items[idx]);
});

// DELETE scorecard (only owner can delete)
app.delete('/api/items/:id', authRequired, async (req, res) => {
  const id = Number(req.params.id);
  let items = await readJson(ITEMS_FILE, []);
  const idx = items.findIndex(i => i.id === id);
  
  if (idx === -1) return res.status(404).json({ error: 'not-found' });
  if (items[idx].owner !== req.user.email) return res.status(403).json({ error: 'forbidden' });
  
  items = items.filter(i => i.id !== id);
  await writeJson(ITEMS_FILE, items);
  
  // Recalculate user handicap
  await updateUserHandicap(req.user.email);
  
  res.json({ ok: true });
});

// ============ HANDICAP CALCULATION ============

async function calculateHandicapFromCards(email) {
  const items = await readJson(ITEMS_FILE, []);
  const cards = items
    .filter(i => i.owner === email)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20); // Last 20 cards
  
  if (cards.length === 0) return null;
  
  // Simplified: calculate average differential
  // Real formula: (strokes - par) * 113 / handicap slope
  const diffs = cards.map(c => Number(c.strokes) - Number(c.par));
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  
  // Apply standard deviation weighting (simplified)
  const handicap = Math.round((avgDiff * 1.2) * 10) / 10;
  return Math.max(0, handicap).toFixed(1);
}

async function updateUserHandicap(email) {
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.email === email);
  if (!user) return;
  
  user.handicap = await calculateHandicapFromCards(email);
  await writeJson(USERS_FILE, users);
}

// POST calculate handicap for a single card (using AI if available)
app.post('/api/ai/handicap', async (req, res) => {
  const card = req.body || {};
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiKey) {
    // Fallback: simple calculation
    const strokes = Number(card.strokes) || 0;
    const par = Number(card.par) || 72;
    const diff = strokes - par;
    const handicap = (diff > 0) ? (Math.round(diff * 1.2 * 10) / 10).toFixed(1) : '0.0';
    return res.json({ handicap });
  }

  try{
    const prompt = `You are a golf assistant. Given a single round with strokes ${card.strokes} and par ${card.par}, estimate the player's differential score. Return JSON only: { "handicap": "12.4" }`;
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for golf handicaps.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 60,
      temperature: 0.2
    };
    
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify(body)
    });
    
    const j = await r.json();
    const txt = j?.choices?.[0]?.message?.content || '';
    const m = txt.match(/([0-9]+\.?[0-9]*)/);
    const handicap = m ? m[1] : '0.0';
    res.json({ handicap });
  }catch(e){
    console.error('AI error', e);
    res.status(500).json({ error: 'ai-failed' });
  }
});

// ============ FRIENDS ============

app.post('/api/friends/add', authRequired, async (req, res) => {
  const { friendId } = req.body;
  if (!friendId) return res.status(400).json({ error: 'missing-friendId' });
  
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.id === Number(req.user.sub));
  const friend = users.find(u => u.id === Number(friendId));
  
  if (!user || !friend) return res.status(404).json({ error: 'not-found' });
  if (!user.friends) user.friends = [];
  
  if (!user.friends.includes(Number(friendId))) {
    user.friends.push(Number(friendId));
    await writeJson(USERS_FILE, users);
  }
  
  res.json({ ok: true, friends: user.friends });
});

app.get('/api/friends', authRequired, async (req, res) => {
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.id === Number(req.user.sub));
  
  const friends = users.filter(u => user.friends?.includes(u.id));
  res.json(friends.map(u => ({
    id: u.id,
    email: u.email,
    handicap: u.handicap
  })));
});

app.delete('/api/friends/:friendId', authRequired, async (req, res) => {
  const friendId = Number(req.params.friendId);
  const users = await readJson(USERS_FILE, []);
  const user = users.find(u => u.id === Number(req.user.sub));
  
  if (!user) return res.status(404).json({ error: 'not-found' });
  user.friends = (user.friends || []).filter(id => id !== friendId);
  
  await writeJson(USERS_FILE, users);
  res.json({ ok: true, friends: user.friends });
});

// ============ SEARCH / DISCOVERY ============

app.get('/api/users/search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (q.length < 2) return res.json([]);
  
  const users = await readJson(USERS_FILE, []);
  const results = users
    .filter(u => u.email.toLowerCase().includes(q))
    .slice(0, 20)
    .map(u => ({ id: u.id, email: u.email, handicap: u.handicap }));
  
  res.json(results);
});

// ============ UPDATE PROFILE ============
app.put('/api/user/profile', authRequired, async (req, res) => {
  const { name, birthDate, bio, photo } = req.body || {};
  
  const users = await readJson(USERS_FILE, []);
  const idx = users.findIndex(u => u.id === Number(req.user.sub));
  if (idx < 0) return res.status(404).json({ error: 'not-found' });
  
  if (name) users[idx].name = name;
  if (birthDate) users[idx].birthDate = birthDate;
  if (bio !== undefined) users[idx].bio = bio;
  if (photo) users[idx].photo = photo;
  
  await writeJson(USERS_FILE, users);
  
  res.json({ 
    id: users[idx].id,
    email: users[idx].email,
    name: users[idx].name,
    birthDate: users[idx].birthDate,
    bio: users[idx].bio,
    photo: users[idx].photo
  });
});

app.listen(PORT, () => console.log(`🏌️ GolfSocial backend running on http://localhost:${PORT}`));
