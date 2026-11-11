# BRD gap (branch `BMS`)

Each row maps a BRD module to code that exists in this repository. Status: Covered, Partial, Missing. Only paths that exist in the tree are cited. Status reflects reading file and model names plus the CRM and HR tests' scope; behaviour was not executed.

| BRD module | Status | Existing code | Missing against the BRD |
| --- | --- | --- | --- |
| M1 Meetings and MoM | Partial | `TechReport/ClientMeetingReportController`, CRM activities (`ContactLeadActivity*`, `activities` component) | Calendar availability, invitations, Minutes of Meeting entity and archive (FR-MTG-01..05) |
| M2 Unit tasks and weekly plans | Covered (Phase 1 core) | `BMS/WeeklyPlanController`, `WeeklyPlan`, `UnitTask`, `SupportRequest`, Angular `bms/plans`; existing `Project/Task` retained | Phase 1 complete: unit profiles/membership, Sunday-start plans, progress/blockers, departmental support, submission and system-generated Sunday report. Later-phase reporting remains in M11. |
| M3 Opportunities and tenders | Covered (Phase 1 core) | CRM `ContactLead` links extended by `BMS/Opportunity`, stage history, decision/alert/import APIs and Angular `bms/opportunities` | Phase 1 complete: Operations-only registration, stage history, Alpha Delta Go/No-Go with reason, delayed/no-update alerts and Excel/CSV tracker import. |
| M4 Product tracking | Covered (Phase 1 core) | Existing `Product` extended with `ProductPhase` and `product_business_unit`; `BMS/ProductTrackingController`, Angular `bms/products` | Phase 1 complete: Kraken/Argus seeds, extensible products, phases/current phase, blockers, data/support needs and multi-unit ownership. |
| M5 Leads and partnerships | Covered (core) | `ContactLead*`, `Contact*`, `OrganizationType`, `Partner`, `PartnerIndustry`, `Campagin*`, CRM reports and dashboard | Lead-to-opportunity link rules, ecosystem tag, lab planning scenarios (FR-LED-04, 05, 08) |
| M6 Recruitment and onboarding | Covered (core) | `HRModule/*` (CV, HiringProcess, OnBoarding, Statuses, TypesAndPhases), `HiringRequest*`, `InterviewPhase`, `OnboardingRequirement`, `RequestOnboarding`, hr hiring-process components | Cross-department onboarding checklist with IT and PR items (FR-HR-05) |
| M7 Procurement | Missing | none | All (FR-PRC-01..03) |
| M8 PR events and protocol | Missing | `Announce*` is adjacent, not equivalent | All (FR-EVT-01..03) |
| M9 Document and brand hub | Missing | Per-record attachments only; `CompanyPolicy` model | Central repository, latest-version control, per-unit sections, unit profile (FR-DOC-01..06) |
| M10 Employee directory | Partial | `User`, `UserDetail`, `JobTitle`, `org-chart` component, profile photos | Marketing directory view, certificates for lab staff (FR-EMP-01..03) |
| M11 Dashboards and reports | Partial | `BMS/ExecutiveDashboardController`, Angular `bms/dashboard`, Excel/PDF export; existing CRM/admin reports retained | Phase 1 unified dashboard complete with unit/product/opportunity filters and exports. Later-phase monthly, quarterly and six-month reports remain (FR-RPT-01..05). |
| Roles and permissions | Covered (Phase 1) | Existing permissions and `CheckModule`, plus `BmsRole`, `bms_role_user`, `BmsAccess`, `bms.permission` middleware | Phase 1 role matrix and unit/department scopes implemented; later modules must reuse the same matrix. |
| Audit trail | Covered (Phase 1 scope) | `BmsAudit`, `bms_audit_logs`, opportunity stage histories | Required opportunity, task and support status/decision auditing implemented. |
| Branding and RTL | Covered (Phase 1) | `alphaiota-logo.png/.png`, `_colors.scss`, Material palettes, email headers, BMS language service | New logo/palette applied to active UI and emails; all Phase 1 screens support English and Arabic RTL. |
| Module enablement (NFR-06) | Covered | `modules`, `company_modules`, `ModuleService`, `/modules` pages | none |

## Next build order (proposal)

Phase 1 is implemented and ready for environment testing; see `docs/BMS_PHASE1.md`. Remaining build order: (2) meetings and minutes, lead/partnership extensions and directory improvements; (3) document hub and onboarding checklist; (4) procurement, PR events and the six-month social media report.
