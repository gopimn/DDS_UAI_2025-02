GolfSocial — Backend (starter)

This folder contains a minimal Express backend used by the frontend in this project.

Features:
- /api/auth/register and /api/auth/login (bcrypt + JWT)
- /api/items CRUD (file-based storage in `data/`)
- /api/ai/handicap proxy to OpenAI (if OPENAI_API_KEY set) or a local heuristic fallback
- /auth/google placeholder (SSO not fully implemented)

Quick start
1. Install dependencies (from `Proyecto/backend`):

   npm install

2. Create a `.env` file with (optional):

   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=sk-...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   PORT=4000

3. Run the server:

   npm start

Endpoints
- GET /health
- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }
- GET /api/items
- POST /api/items (Authorization: Bearer <token>)
- PUT /api/items/:id (Authorization: Bearer <token>)
- DELETE /api/items/:id (Authorization: Bearer <token>)
- POST /api/ai/handicap { strokes, par, date, course }
- GET /auth/google (placeholder)

Notes
- Storage is file-based in `data/` and intended for development only.
- For production use replace with a proper database and secure the auth flows.
