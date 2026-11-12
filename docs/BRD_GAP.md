# BRD coverage (branch `BMS`)

Status after the complete BRD implementation. Detailed endpoints, permissions, storage and deployment notes are in `docs/BMS_BRD_IMPLEMENTATION.md`.

| BRD module | Status | Implementation |
| --- | --- | --- |
| M1 Meetings and MoM | Covered | Availability/conflicts, email + ICS invitations, responses, linked searchable minutes |
| M2 Unit tasks and weekly plans | Covered | Plans, per-employee tasks, support, development items, Sunday report |
| M3 Opportunities and tenders | Covered | Full stages/history, decisions, alerts, versioned documents, tracker import |
| M4 Product tracking | Covered | Products, phases, needs/blockers and shared unit ownership |
| M5 Leads and partnerships | Covered | Entity database, stages, interactions, ecosystem/lab plans, conversion and export |
| M6 Recruitment and onboarding | Covered | Requests, CVs, interviews, hiring timeline and service-department checklist |
| M7 Procurement | Covered | Requests, multiple quotations, Finance budget decision |
| M8 PR events and protocol | Covered | Requests, protocol checklist and published procedures |
| M9 Document and brand hub | Covered | PR publishing, one latest version, archive, company/unit brand assets |
| M10 Employee directory | Covered | Directory, photos/titles and scoped staff certificates |
| M11 Dashboards and reports | Covered | Live dashboard, weekly/monthly/90-day/six-month reports, Excel/PDF |
| Roles and permissions | Covered | Central role matrix, unit scopes, protected downloads and server-side abilities |
| Audit trail | Covered | Actor/old/new values, decisions, status changes, uploads and conversions |
| Branding and RTL | Covered | Alphaiota identity and English/Arabic BMS workspace |
| Module enablement | Covered | Existing `bms` company entitlement plus route middleware |

External-provider calendar synchronisation, production backup/data-residency settings and target service levels depend on the BRD's explicitly open infrastructure questions. No provider or target has been invented.


---

## Unified BMS completion pass (2026-11-12, branch `arena/3166aee5-fgsportal`)

The old optional-module journey is retired and the gaps under "Section 5 employee
management" and "Section 18 security" are closed. Detailed traceability and the
GO/NO-GO decision live in `docs/BMS_UNIFICATION_REVIEW.md`.

| Area | Change | Verification |
| --- | --- | --- |
| Modules experience | `/modules` and `/modules/:slug` redirect into `/bms/dashboard`; navbar entry removed; the BMS workspace no longer sits behind the company-module entitlement (`bms` is core, migration `2026_11_12_000009`) | Angular build; `P1KernelRegressionTest`, `BmsRouteSafetyTest`, `ModuleManagementEndpointsTest`, `P08CoreEndpointCoverageTest` (written, not executed here) |
| Login entry point | Department-based redirects replaced by a single BMS landing derived from server abilities, with `BmsPermissionGuard` and a "no access" screen | TypeScript build; manual code review |
| Employee management | New `EmployeeController` (list/show/create/update/status/photo), `EmployeeManagementComponent`, recruitment "hire and create account" flow | `P17EmployeeManagementTest` (11 tests, written) |
| Directory / lookup scoping | Directory, lookups and certificate/photo downloads now enforce unit scope server-side | `P17EmployeeManagementTest` |
| Role assignment | Target-user scope checks, global-vs-unit rules, System Administrator restricted to Administration, self-revocation blocked, role-change audit endpoint + UI | `P17EmployeeManagementTest` |
| Business units | Parent-cycle guards, dependency-aware safe deletion, activate/deactivate endpoint and UI | `P17EmployeeManagementTest` |
| Products | Archive endpoint + UI, archived products excluded from the working list | code review |
| Weekly plans | `GET /bms/my-tasks` + "My tasks" screen with progress/blocker updates | `P17EmployeeManagementTest` |

### Not delivered in this pass (still open)

Procurement/meeting/document flows were reviewed only; no code change was required
to keep them working. Remaining gaps and the business questions from the original
BRD remain as listed above and in `docs/BMS_UNIFICATION_REVIEW.md`.
