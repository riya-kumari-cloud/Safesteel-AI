# SafeSteel-AI: Enterprise Safety Platform

SafeSteel-AI is an end-to-end, production-ready industrial safety management system. It leverages React, Node.js, and MongoDB to provide real-time hazard monitoring, PPE compliance tracking, incident reporting, and an integrated AI Safety Assistant.

## 🚀 Features

- **Authentication & RBAC:** Secure JWT-based authentication with role-based access control (Admin, Safety Inspector, Worker).
- **Incident Management:** Real-time reporting and resolution of safety incidents using MongoDB for persistent storage.
- **Edge Vision Dashboard:** Real-time mock telemetry for PPE detection and machinery diagnostics.
- **AI Safety Assistant:** Integrated AI Copilot with a graceful fallback architecture (supports Gemini/OpenAI).
- **Responsive UI:** Dark-mode optimized, professional dashboard interface built with Tailwind CSS and Lucide icons.

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router (via state context)
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs, Helmet
- **Infrastructure:** Docker, Docker Compose, MongoMemoryServer (for local testing without a database daemon)

## 🏗 Architecture

The project is structured as a monorepo containing decoupled frontend and backend services:
- `/frontend`: Vite-powered React Single Page Application (SPA).
- `/backend`: Express REST API.
- Both services can run independently or be orchestrated together via Docker.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (optional for local dev if using the fallback Memory Server)
- Docker (optional)

### Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key

# Optional: Uses in-memory DB if omitted or local
MONGODB_URI=mongodb://localhost:27017/safesteel 
# Optional: Enables real AI response
GEMINI_API_KEY=your_gemini_api_key
```

### Running Locally (Without Docker)

**1. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Running with Docker

Run the entire stack (Frontend, Backend, and MongoDB) using Docker Compose from the root directory:
```bash
docker-compose up --build
```
The application will be available at `http://localhost:5173`.

## 🔐 API & Authentication

The backend is secured using JSON Web Tokens (JWT). All requests to protected routes (e.g., `/api/incidents`, `/api/ppe`) must include an `Authorization` header:
`Authorization: Bearer <your_jwt_token>`

- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate and retrieve a JWT

## 🚢 Deployment Instructions

**Frontend (Vercel / Netlify):**
1. Set the root directory to `frontend/`.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist/`.
4. Add `VITE_API_URL` to point to your deployed backend URL.

**Backend (Render / Railway / Heroku):**
1. Set the root directory to `backend/`.
2. Set the start command to `npm start`.
3. Add `MONGODB_URI` (Atlas string), `JWT_SECRET`, and `FRONTEND_URL` to the environment variables.

---
*Built as a professional internship submission.*
