# BMS BRD 1.0 — implementation contract

This document is the implementation traceability for the BRD dated 11 November 2026. The BMS workspace contains only the BRD business workflows and their supporting unit, role, alert and export functions. Existing non-BMS portal modules are not part of this workspace.

## Module coverage

| BRD module | Implementation | Requirement coverage |
| --- | --- | --- |
| M1 Meetings and MoM | `MeetingController`, meetings screen | Internal attendee availability and conflicts; internal/external invitations by email with an ICS calendar attachment; authenticated internal responses and token-protected external response links; invitation delivery/response status; optional minutes with discussion, decisions and actions; links to units, leads, opportunities and products with meeting history shown on each linked record; search by title, attendee, minutes text and date. |
| M2 Unit tasks and weekly plans | Phase-one controllers plus `DevelopmentController` | Sunday-start plans, per-employee tasks, progress, blockers, completion, optional next-week plan, support request ownership/history, Sunday report, courses/training/awareness/CDMP/certification tracking. |
| M3 Opportunities and tenders | `OpportunityController`, alerts and document APIs | Operations registration, unit/owner/deadline, review/RFP/financial-proposal/submission/outcome stages, dated stage history, delayed and no-update alerts to owners/coordinators, Alpha Delta go/no-go and reason, versioned RFP/financial documents, appointments/training documents, Excel/CSV import with row errors. |
| M4 Product tracking | `ProductTrackingController` | Extensible products, seeded Kraken/Argus, ordered phases/current phase, blockers, data and support needs, multi-unit ownership. |
| M5 Leads and partnerships | `LeadController`, `PipelineStageController` | Government/private/individual/partner/collaborator records, contacts, administrator-configured bilingual stage list, dated interactions and outcomes, ecosystem tags, both genetic-lab scenarios with owned study tasks/status/dates, conversion to a linked opportunity, linked meeting history, filters and role-scoped export. |
| M6 Recruitment and onboarding | `RecruitmentController` | Unit request and specification, Coordinator/HR statuses, private CV upload/download, interview date/notes/decision, CV-to-first-day timeline, enforced pass-before-hire, exactly-once IT email/laptop + PR directory + HR records checklist. |
| M7 Procurement | `ProcurementController` | Item/quantity/purpose, multiple vendor quotation files and amounts, Finance approval/rejection, mandatory comment and budget confirmation for approval. |
| M8 PR events and protocol | `EventController` | Event routing, signing/visit/conference/campaign types, photography/announcement/entry/parking/exit checklist, visitor protocol, published procedure knowledge base. |
| M9 Document and brand hub | `DocumentController` | Company/unit categories, profiles/proposals/presentations/logos/colours/templates, PR-only upload/publish, atomic latest pointer, archived version history, authenticated downloads. Unit descriptive profiles and services remain in M2 unit administration. |
| M10 Employee directory | `DirectoryController` | Searchable active employees, name/title/photo/email/unit/hiring date, certificate upload/download scoped to the assigned unit, employee association in onboarding. |
| M11 Dashboards and reports | Executive dashboard, `ReportController`, `BmsExportService` | Live unit/product/opportunity filters, submitted/delayed/no-update tenders, unit and product progress, weekly Sunday report, monthly performance, configurable 90-day KPIs, six-month social metrics, Excel/PDF exports on every BMS list. |

## Roles and data access

`BmsAccess` is the server-side source of truth. UI ability checks are convenience only; every API uses `jwt.verify`, the BMS module entitlement and `bms.permission`.

Seeded roles: System Administrator, Executive Management, Coordinator, Operations, Unit Director, Department Manager, Alpha Delta Decision Maker, PR & Marketing, Finance, HR, IT and Employee. The Access & Roles screen assigns/revokes global or unit-scoped roles and displays the permission matrix; the same screen and all lists support Excel/PDF export. Unit Directors receive only their assigned/directed unit IDs. Global operational roles are explicit. Leads, tasks, opportunities, products, meetings, recruitment and events apply unit scopes again inside controllers to prevent direct-object-reference bypasses. Certificates and private files repeat authorization on download.

All significant creates, status changes, decisions, uploads and conversions write `bms_audit_logs` with actor, old/new values and reason where applicable. Opportunity stage transitions additionally retain their dedicated chronological history.

## Storage and integrations

- Private uploads use Laravel's `local` disk under `storage/app/bms`: CVs, quotations, opportunity documents, brand documents and certificates. Download endpoints require JWT and authorization; files are not public assets.
- Meeting invitations use configured Laravel SMTP and include a standards-based `text/calendar` REQUEST attachment. Availability is calculated from BMS meetings. Synchronisation with an external corporate calendar remains dependent on BRD Q4 identifying that provider.
- Excel tracker import accepts the original spreadsheet after client-side workbook parsing, or CSV directly. Spreadsheet dates use their local calendar day rather than a UTC-shifted value. Validation errors identify spreadsheet rows and do not hide partial-import results.
- PDF tables are browser-rendered with the supplied Alphaiota mark so Arabic shaping and RTL are preserved; Excel worksheets automatically switch to RTL when their data contains Arabic.
- `BMS_OPPORTUNITY_STALE_DAYS` (default `7`) controls the no-update threshold pending final agreement in BRD Q6. Delayed opportunities use the expected close/deadline date.
- Currency for new opportunities and quotations is SAR. Existing stored values are not rewritten.
- Backup/recovery, data residency, external identity/calendar providers and production availability targets remain deployment decisions from the BRD open questions, not hard-coded assumptions.

## Deployment order

1. Run Laravel migrations through `2026_11_11_000002_complete_bms_brd_tables.php`.
2. Run `BmsPhaseOneSeeder` (idempotent) to add the expanded roles, units and initial products; assign the narrower roles to users.
3. Configure SMTP, the private Laravel filesystem and `BMS_OPPORTUNITY_STALE_DAYS`.
4. Build the Angular application and verify each role against its intended unit scope before retiring the Excel tracker.

## Validation

The Angular Node suite includes BRD catalogue, endpoint/table, mandatory-field, scenario and bilingual-label contract tests in `bms-catalog.spec.ts`, alongside the existing module registry and permission-cache tests. Final checks: 28/28 Node specs, Angular development and production builds, 49 changed PHP files parsed, all BMS route/controller bindings and model/table references checked, and `git diff --check`. Production font inlining is disabled in `angular.json` so deployment does not fail when Google Fonts is unreachable at build time; the browser font link remains unchanged. Runtime database/SMTP execution still requires the target Laravel environment.
