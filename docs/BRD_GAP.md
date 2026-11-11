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
