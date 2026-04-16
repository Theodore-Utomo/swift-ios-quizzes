# Gallaugher's Quiz APp
A full-stack quiz platform for **Swift iOS and Python Circuitry** learning. Instructors can create courses and quizzes; students take quizzes and track their progress. Built for course use (e.g. Gallaugher-style curricula) with role-based access and a simple, focused UI.


## Tech stack

| Layer    | Stack |
|----------|--------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Router |
| Backend  | FastAPI (Python), Firestore (Firebase), Stytch (auth) |
| DevOps   | Docker (backend) |

## Project structure

```
swift-ios-quizzes/
├── frontend/          # React + Vite app (port 5173)
│   ├── src/
│   │   ├── components/   # UI, instructor dashboard, quiz views
│   │   ├── pages/        # Course list, course details, etc.
│   │   └── ...
│   └── package.json
├── backend/           # FastAPI app (port 8000)
│   ├── app/
│   │   ├── routes/      # auth, courses, quizzes, quiz progress, feedback, statistics
│   │   ├── services/    # business logic + Firestore
│   │   ├── middleware/  # auth, rate limiting, security headers, logging
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
└── README.md           # you are here
```

## Getting started

### Prerequisites

- Node.js (for frontend)
- Python 3.11+ and `pip` (or use Docker for backend)
- A [Firebase](https://firebase.google.com) project with Firestore
- A [Stytch](https://stytch.com) project for auth


### Backend (local)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: **http://localhost:8000** — docs at **http://localhost:8000/docs**.

### Backend (Docker)

```bash
cd backend
# Ensure .env is present
docker compose up --build
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**. Set `ALLOWED_ORIGINS` (and any API base URL) so the frontend can call the backend.

## API overview

| Area        | Prefix / purpose |
|------------|------------------|
| Auth       | Stytch session validation, user context |
| Courses    | `/courses` — CRUD, list |
| Quizzes    | `/quizzes` — CRUD per course |
| Progress   | `/QuizProgress` — student quiz progress |
| Feedback   | `/feedback` — feedback submissions |
| Statistics | Dashboard counts (students, courses, quizzes) |

Health: `GET /health` (with DB check), `GET /healthz` (simple ok).

## License

This project is licensed under the [MIT License](LICENSE).
