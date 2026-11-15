# BMS Frontend (React)

Brand-new Business Management Solutions UI. The Laravel backend in `../backend` remains the source of truth — this app only consumes it.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router v6 · TanStack Query · Axios · Recharts · Framer Motion · Lucide

## Setup

```bash
cd frontend-react
cp .env.example .env.development   # already present
npm install
npm run dev
```

| Variable | Meaning |
|---|---|
| `VITE_API_BASE_URL` | Laravel origin, **without** `/api` (the client appends it). |
| `VITE_DEMO_MODE` | `true` serves payloads shaped like the real BMS responses so the UI can be reviewed without a live API. Set `false` against a real backend. |

Auth: `POST {VITE_API_BASE_URL}/api/users/login` (username **or** email + password). JWT is sent as `Authorization: Bearer …` and also mirrored into `localStorage.userData._token` for compatibility with the existing Angular app.

BMS calls go to `{VITE_API_BASE_URL}/api/bms/...`. Ability checks use `GET /api/bms/lookups` → `can` (wildcard `*` = system admin).

Wired screens (real Laravel routes):

- Dashboard — `GET /bms/executive-dashboard`
- Opportunities — `GET /bms/opportunities`, `GET /bms/opportunities/{id}`
- Units / organization / teams — `GET /bms/units`, `GET /bms/teams`
- Weekly plans / my tasks — `GET /bms/weekly-plans`, `GET /bms/my-tasks`
- Leads, meetings, products
- Directory — `GET /bms/directory`, `GET /bms/employees/{id}`
- Recruitment, development, procurement, events, procedures, documents
- Reports — `GET /bms/reports/monthly|kpis|social`
- Access — lookups roles + `GET /bms/audit/role-changes`
