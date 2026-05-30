# TROY

**The Operating System For Modern Development**

TROY is a unified infrastructure control center that connects GitHub, Vercel, Supabase, Railway, AWS, Docker, Kubernetes, and your entire stack into one synchronized workspace.

## Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, shadcn/ui, Zustand, React Query
- **Backend:** Next.js API Routes, Server Actions
- **Database & Auth:** Supabase PostgreSQL + Supabase Auth
- **Realtime:** Supabase Realtime
- **Icons:** Simple Icons (official provider logos)

## Getting Started

```bash
npm install
cp .env.example .env.local   # configure Supabase + OAuth keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| `NEXT_PUBLIC_APP_URL` | App URL for callbacks |

Apply the database schema from `supabase/schema.sql` in your Supabase SQL editor.

## Dashboard

| Route | Feature |
|-------|---------|
| `/dashboard` | Overview, metrics, activity, AI recommendations |
| `/dashboard/projects` | Project grid & list views |
| `/dashboard/deployments` | Deployment history & analytics |
| `/dashboard/infrastructure` | Pipeline topology visualization |
| `/dashboard/monitoring` | CPU, memory, latency, incidents |
| `/dashboard/logs` | Terminal log streaming |
| `/dashboard/ai` | AI workspace (GPT, Claude, Gemini) |
| `/dashboard/integrations` | Provider connections |
| `/dashboard/security` | API keys, OAuth, audit logs |
| `/dashboard/billing` | Plans & usage |

Press **⌘K** anywhere in the dashboard to open the command palette.

## Build

```bash
npm run build
npm start
```
