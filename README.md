# Resume Builder

AI-powered resume builder with multi-language support (EN/PL) and AI-generated topic descriptions.

## Architecture

```
resume-builder/
├── apps/
│   ├── backend/     # Fastify API + AI agents (LangGraph)
│   └── frontend/    # Vite + React SPA
└── packages/
    └── shared/      # Shared TypeScript types
```

**Backend:** Fastify, Drizzle ORM (Postgres), LangChain/LangGraph (OpenAI), JWT auth  
**Frontend:** Vite, React, Axios with JWT refresh interceptor

## Setup

```bash
# Install all dependencies
npm install

# Set up environment variables
# Backend: apps/backend/.env
#   JWT_SECRET_KEY=<secret>
#   COOKIE_SECRET_KEY=<secret>
#   OPENAI_API_KEY=<key>
#   ENABLE_REGISTRATION=true|false
#   NODE_ENV=development|production
#
# Frontend: apps/frontend/.env
#   VITE_API_URL=http://localhost:3000
#   VITE_ENABLE_REGISTRATION=true|false

# Run database migrations
npx drizzle-kit push

# Start development servers
npm run dev:backend    # → http://localhost:3000
npm run dev:frontend   # → http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend dev server |
| `npm run dev:frontend` | Start frontend dev server |
| `npm run build` | Build both apps |
| `npm run lint` | Lint all workspaces |
