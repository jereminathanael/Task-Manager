# Task Manager 📋

A fullstack task management web app with role-based access, session-based authentication, and full CRUD operations.

---

## Features

- **Pre-registered manager account** — auto-created on server startup if not exists
- **Session-based login** — session expires after 1 hour 2 minutes
- **Auth middleware** — unauthenticated users can only access the login page, all other routes are protected
- **CORS restricted** — only allows requests from `http://localhost:5173` (configurable in `backend/server.js`)
- **Task CRUD** — create, read, update status, and delete tasks
- **Task history** — track changes per task
- **Dashboard** — overview of task data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | express-session, bcrypt |
| Other | CORS, middleware |

---

## Default Account

A manager account is automatically created when the server starts for the first time:

| Field | Value |
|---|---|
| Username | `User123` |
| Password | `12345` |

---

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [PostgreSQL](https://www.postgresql.org)

---

## Environment Setup

Before running the project, create a `.env` file inside the `backend/` directory:

```env
password={your_postgresql_password}
SESSION_SECRET={any_random_string}
```

> Replace `{your_postgresql_password}` with your actual PostgreSQL password and `{any_random_string}` with any secret string for session encryption.

---

## Database Setup

Run the provided schema file to create the required tables:

```bash
psql -U postgres -d your_database_name -f Schema.sql
```

---

## How to Run

### Backend

```bash
cd backend
npm install
npm run start
```

Server runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Routes

All routes except `/login` and `/logout` are protected by `authMiddleware`. Unauthenticated requests will be rejected.

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/login` | Login with username & password, creates session | No |
| POST | `/logout` | Destroys session | No |

### Tasks

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/` | Get all tasks | Yes |
| GET | `/me` | Get current logged-in user | Yes |
| GET | `/dashboard` | Get dashboard summary | Yes |
| GET | `/task/:id/history` | Get history of a specific task | Yes |
| POST | `/task` | Create a new task | Yes |
| PATCH | `/task/:id` | Update task status | Yes |
| DELETE | `/task/:id` | Delete a task | Yes |

---

## Auth & Session Details

- Passwords are hashed using **bcrypt** (salt rounds: 10)
- Session is stored server-side using **express-session**
- Session cookie config:
  - `httpOnly: true` — not accessible via JavaScript
  - `secure: false` — set to `true` in production with HTTPS
  - `maxAge: 3,720,000ms` — expires after **1 hour 2 minutes**
- CORS is configured to only allow `http://localhost:5173` with credentials

To change the allowed origin, update this line in `backend/server.js`:

```js
cors({
  origin: "http://localhost:5173", // change this to your frontend URL
  credentials: true,
})
```

---

## Project Structure

```
.
├── backend/
│   ├── controllers/
│   │   └── taskController.js   # Task logic (getTasks, createTask, etc.)
│   ├── middleware/
│   │   └── authmiddleware.js   # Auth guard for protected routes
│   ├── routes/
│   │   └── taskRoute.js        # Task routes
│   ├── db.js                   # PostgreSQL connection
│   ├── index.js                # Express app entry point
│   └── .env                    # Environment variables (not committed)
├── frontend/                   # React + Tailwind frontend
├── Schema.sql                  # Database schema
└── package.json
```