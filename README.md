# AgentTask — LeadManager Pro (minimal README)

Very simple instructions to run the project locally.

Project layout
- backend/  -> Express + MongoDB API server
- frontend/ -> Vite + React UI + Tailwind

Quick start (Windows / PowerShell)

1) Backend
```powershell
cd C:\Users\LENOVO\Documents\GitHub\agenttask\backend
npm install
# create a .env with MONGODB_URI and optionally PORT (default 5000)
# example .env contents:
# MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/yourdb
# PORT=5000
node index.js
# or, if you use nodemon:
nodemon run
```

Run admin seed (create initial admin user)
```powershell
# from backend folder
cd backend 
npm run seed:admin
# If you use nodemon, you can run: nodemon --exec "node scripts/seedAdmin.js"
```

Server will listen on PORT (default 5000). API base: http://localhost:5000/api

Useful backend routes
- POST /api/auth/login        -> login
- POST /api/admin/add-agent  -> add agent (admin)
- GET  /api/admin/agents     -> list agents (admin)
- POST /api/sheets/upload    -> upload sheet (protected)
- GET  /api/sheets/allsheet  -> list all sheets (admin)
- GET  /api/stats/agents     -> returns { count }
- GET  /api/stats/sheets     -> returns { totalSheets, totalRows }

2) Frontend
```powershell
cd C:\Users\LENOVO\Documents\GitHub\agenttask\frontend
npm install
npm run dev
```
Default dev server runs on Vite default (usually http://localhost:5173).

Notes
- The frontend expects a token in localStorage under key `token` (the `api.js` client sets Authorization header when token is present).
- The admin pages are under `/admin/*` and require admin login.
- If you change backend PORT, update `frontend/src/api.js` `API_URL` accordingly.
- If you change frontend PORT, update CORS in backend index.js accordinglt
