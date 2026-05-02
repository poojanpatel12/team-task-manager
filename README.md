# Team Task Manager

A full-stack project & task management app with role-based access control (Admin / Member).


## 🚀 Live Demo & Repository
- **Live Demo:** [https://team-task-manager-xrg8.onrender.com](https://team-task-manager-xrg8.onrender.com)
- **GitHub Repository:** [https://github.com/Poojanpatel12/Team-Task-Manager](https://github.com/Poojanpatel12/Team-Task-Manager)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Router v6 |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |
| Auth | JWT (7-day expiry) + bcryptjs |

## Features

- **Auth** — Signup / Login with JWT. Role selected at registration (Admin or Member)
- **Projects** — Create, view, update, delete projects. Members only see projects they belong to; Admins see all
- **Tasks** — Create tasks with title, description, assignee, priority (low/medium/high), and due date. Update status inline (pending → in-progress → completed). Overdue tasks are highlighted
- **Dashboard** — Stat cards: Projects, Total, Pending, In Progress, Completed, Overdue. Visual progress bar
- **Team Management** — Admin-only page listing all users with roles
- **Member Management** — Add/remove members from a project (Admin or project owner)

## Role-Based Access

| Action | Admin | Member |
|--------|-------|--------|
| See all projects | ✅ | ❌ (own only) |
| Create project | ✅ | ✅ |
| Delete any project | ✅ | ❌ (own only) |
| Manage members | ✅ | Owner only |
| View Team page | ✅ | ❌ |
| Create/delete tasks | ✅ | Project members |
| Update task status | ✅ | Project members |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Run locally

```bash
# From project root
cd scripts && ./start-dev.sh
```

Or manually:

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env   # edit MONGODB_URI and JWT_SECRET
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Docker

```bash
cd infra
docker compose up --build
```

- App: http://localhost:5173

## API Reference

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✅ | Current user |

### Projects
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/projects | ✅ | List projects |
| POST | /api/projects | ✅ | Create project |
| GET | /api/projects/:id | ✅ | Get project |
| PUT | /api/projects/:id | ✅ | Update project |
| DELETE | /api/projects/:id | ✅ | Delete project |
| POST | /api/projects/:id/members | ✅ | Add member |
| DELETE | /api/projects/:id/members/:userId | ✅ | Remove member |

### Tasks
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/tasks | ✅ | Create task |
| GET | /api/projects/:projectId/tasks | ✅ | List tasks |
| PUT | /api/tasks/:id | ✅ | Update task |
| DELETE | /api/tasks/:id | ✅ | Delete task |

### Dashboard & Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/dashboard | ✅ | Stats summary |
| GET | /api/users | Admin | All users |
