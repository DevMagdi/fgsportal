# BMS React workspace

A React 18 / TypeScript console for the Laravel BMS. Existing routes, JWT authentication, ability checks, and English / Arabic RTL support are retained. The interface includes searchable, filterable, paginated collections; creation and editing dialogs; confirmations and bulk removal; detail tabs; and a keyboard-accessible navigation palette (`Ctrl/⌘ K`).

## Run

Use Node.js 18.13 or newer (Node 20/22 recommended).

```bash
cd frontend-react
npm ci

# Self-contained demo (any username and a password of at least 4 characters)
VITE_DEMO_MODE=true npm run dev -- --host 0.0.0.0

# Or use the Laravel API
cp .env.example .env.local
# Set BMS_PROXY_TARGET to the Laravel origin in .env.local if it runs separately.
npm run dev -- --host 0.0.0.0
```

`VITE_API_BASE_URL` may be set to a public Laravel origin when needed, but an empty value is preferred: the browser uses relative `/api/...` URLs. For local development, `BMS_PROXY_TARGET` configures a **server-side** Vite proxy to Laravel, so preview browsers do not need to reach `localhost`. In production, route `/api` to Laravel through the deployment's reverse proxy or configure a public API origin. The React app still authenticates with `POST /api/users/login`, sends the bearer token, and mirrors the session into the legacy `userData` storage shape.

Set the build-time `VITE_BMS_SERVER_TIME_ZONE` to the same IANA timezone as Laravel's `config/app.php` (`Africa/Cairo` in this checkout). Date-only fields retain their server calendar date, while meeting and event forms show the browser's local time and send the server-local wall time expected by this Laravel version. Repeated or nonexistent daylight-saving times are rejected rather than silently scheduled at the wrong instant. Rebuild the frontend if the Laravel timezone changes.

```bash
npm run typecheck
npm run build
npm test
```

The tests exercise the demo store and mock HTTP contracts; they do not require a running Laravel installation.

## Demo behavior

All listed entities, including bonuses, support create, read, edit and remove in demo mode. Records and their relationships persist in this browser's `localStorage` under `bms.demo.workspace.v2`. Clear that key to restore the fixtures. Demo passwords are never saved. Document uploads retain **metadata only**, not file bytes, so demo documents cannot be downloaded. Demo activity is local to the browser. Real API mode never falls back to local demo records on a failed request.

A unit with dependent records cannot be deleted; deactivate it instead. The demo also guards hierarchy cycles and dependent employee deletion. Submitted plans are read-only for plan edits, matching the existing server rules.

## Laravel write coverage and gaps

The client uses the existing BMS POST/PUT/DELETE routes where they exist, including nested task creation and opportunity document uploads. Unit and team deletion use their Laravel DELETE routes. In live mode, removing an employee **deactivates** them (`POST /employees/{id}/status`), removing a product **archives** it (`POST /products/{id}/archive`), and removing a meeting **cancels** it (`POST /meetings/{id}/cancel`); these preserve server history.

The current Laravel checkout does **not** expose the following BMS operations. The client has isolated methods targeting the conventional routes below, but the server must implement and authorize them before those actions work in live mode. Errors are displayed and optimistic changes are rolled back; no success is simulated.

| Entity | Missing live API operations |
| --- | --- |
| Bonuses / incentives | `GET/POST /bms/bonuses`, `PUT/DELETE /bms/bonuses/{id}`. The frontend contract is `Bonus` in `src/lib/types.ts` (`employee_id`, `business_unit_id`, `title`, `amount`, `currency`, `awarded_on`, `status`, `notes`). The UI requires dedicated `bonuses.view` / `bonuses.manage` abilities (or the administrator wildcard), rather than exposing compensation to every directory viewer. The server must define and enforce these abilities and unit scope when implementing the API. |
| Opportunities | `DELETE /bms/opportunities/{id}`. The current Laravel update validator does not accept `notes`; editing notes is therefore available in demo mode only. |
| Weekly plans / tasks | `DELETE /bms/weekly-plans/{id}`, `DELETE /bms/tasks/{id}`. Submitted plans cannot be edited. |
| Products / employees | The current product update filters out null values, so the UI prevents clearing an existing owner or description. Employee updates similarly cannot clear an existing work degree. |
| Leads, recruitment, development | `DELETE /bms/leads/{id}`, `DELETE /bms/recruitment/{id}`, `DELETE /bms/development-items/{id}`. Hiring itself requires Laravel's candidate-hire action; this UI does not yet expose that workflow and does not directly set the `hired` status. |
| Procurement | `PUT/DELETE /bms/procurement/{id}`. |
| Events | `DELETE /bms/events/{id}`. |
| Documents / procedures | `PUT/DELETE /bms/documents/{id}`, `PUT/DELETE /bms/procedures/{id}`. Document creation uses the existing multipart upload endpoint. |

The existing API does not provide a generic per-entity activity endpoint; activity tabs explicitly show that limitation in live mode. Unit / employee bonus tabs depend on the missing BMS bonus API. Server-side permissions and unit scope remain authoritative for all writes.
