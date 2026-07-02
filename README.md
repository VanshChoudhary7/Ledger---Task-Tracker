# Ledger — MERN Task Tracker

A full CRUD task tracker built on the MERN stack.

```
task-tracker/
├── backend/     Express REST API + Mongoose models (Node.js)
└── frontend/    React app (Vite) — the "Ledger" UI
```

## Features

- Create, read, update, delete tasks
- Fields: title (required), description, status (`todo` / `in-progress` / `done`), priority (`low` / `medium` / `high`), due date
- Client-side **and** server-side validation (title length, description length, valid enum values)
- Search by title, filter by status/priority — all server-backed via query params
- Optimistic UI: toggling "done", editing, and deleting update the screen instantly, no page reloads
- Responsive layout (single column on mobile, ledger-line layout on desktop)
- Centralized Express error handling for validation/cast/duplicate-key errors

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, plain CSS (no UI framework) |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |

---

## 1. Run it locally

### Prerequisites
- Node.js 18+
- A MongoDB connection string — either:
  - Local: install MongoDB Community Server and use `mongodb://127.0.0.1:27017/task-tracker`, or
  - Free cloud DB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (recommended, see step 2 below)

### Backend

```bash
cd backend
cp .env.example .env      # then edit MONGO_URI, CLIENT_ORIGIN
npm install
npm run dev                # nodemon, http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173 — the app talks to your local API.

### REST API reference

| Method | Route | Description |
|---|---|---|
| GET | `/api/tasks` | List tasks. Query params: `status`, `priority`, `search` |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Task body:
```json
{
  "title": "Draft the quarterly report",
  "description": "Include Q2 numbers",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-07-15"
}
```

---

## 2. Get a free cloud database (MongoDB Atlas)

1. Create a free account at https://www.mongodb.com/cloud/atlas/register
2. Create a free **M0** cluster.
3. Under **Database Access**, add a database user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) so your deployed backend can reach it.
5. Click **Connect → Drivers**, copy the connection string, and swap in your password and a database name, e.g.:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/task-tracker
   ```
   That's your `MONGO_URI`.

---

## 3. Deploy to public URLs

This repo is ready to deploy as-is. The steps below need your own accounts on the hosts (I can't create those on your behalf), but everything on the code side is already set up.

### Backend → Render (free tier)

1. Push this repo to GitHub.
2. Go to https://render.com → **New → Web Service** → connect your repo, set **Root Directory** to `backend`.
3. Render auto-detects `render.yaml`, or set manually:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables:
   - `MONGO_URI` → your Atlas connection string
   - `CLIENT_ORIGIN` → your frontend URL (you'll add this after step below; you can update it later)
   - `PORT` → `5000` (Render also sets its own `PORT`; Express already reads `process.env.PORT`)
5. Deploy. You'll get a URL like `https://task-tracker-api.onrender.com`.

*(Railway or Fly.io work the same way if you prefer them over Render.)*

### Frontend → Vercel (free tier)

1. Go to https://vercel.com → **Add New → Project** → import the same repo, set **Root Directory** to `frontend`.
2. Framework preset: Vite (auto-detected).
3. Add environment variable:
   - `VITE_API_URL` → `https://task-tracker-api.onrender.com/api` (your Render URL + `/api`)
4. Deploy. You'll get a URL like `https://task-tracker.vercel.app`.

*(Netlify works identically: build command `npm run build`, publish directory `dist`.)*

### Final step — connect the two

Go back to Render → your backend's environment variables → set `CLIENT_ORIGIN` to your Vercel URL (e.g. `https://task-tracker.vercel.app`), and redeploy the backend so CORS allows it.

Your app is now live at your Vercel URL, backed by your Render API and Atlas database.

---

## Project structure

```
backend/
├── config/db.js              Mongo connection
├── models/Task.js             Mongoose schema + validation
├── controllers/taskController.js   CRUD handlers
├── routes/taskRoutes.js       Route definitions
├── middleware/errorHandler.js Centralized error responses
└── server.js                  App entry point

frontend/
├── src/
│   ├── api/tasks.js            fetch() wrapper for the API
│   ├── components/
│   │   ├── TaskForm.jsx        Create/edit form + validation
│   │   ├── TaskItem.jsx        Single task row
│   │   ├── TaskList.jsx        List + empty/loading/error states
│   │   └── FilterBar.jsx       Search + status/priority filters
│   ├── styles/index.css
│   └── App.jsx
```
