# BRD gap (branch `BMS`)

Each row maps a BRD module to code that exists in this repository. Status: Covered, Partial, Missing. Only paths that exist in the tree are cited. Status reflects reading file and model names plus the CRM and HR tests' scope; behaviour was not executed.

| BRD module | Status | Existing code | Missing against the BRD |
| --- | --- | --- | --- |
| M1 Meetings and MoM | Partial | `TechReport/ClientMeetingReportController`, CRM activities (`ContactLeadActivity*`, `activities` component) | Calendar availability, invitations, Minutes of Meeting entity and archive (FR-MTG-01..05) |
| M2 Unit tasks and weekly plans | Partial | `Project/Task`, `Project/Process`, `Report/*`, `AdminReport/*`, `TaskTeam`, timesheet components | Business-unit entity, weekly plan and Sunday submission, support requests to departments, optional next-week plan (FR-UNT-01, 03, 04, 06, 07) |
| M3 Opportunities and tenders | Partial | CRM leads, opportunity, closed deals; `RequestRFP*` (`RequestRFPToApprove`), `RequestPoc*`; `crm/Components/opportunity`, `poc-requests`, `closed-leads` | Operations-only registration rule, Alpha Delta go/no-go with reason, no-update alerts, Excel import (FR-OPP-04, 05, 07) |
| M4 Product tracking | Partial | `Product`, `SubProduct`, `Project`, `ProjectStructure` | Per-product phases, blockers, data and support needs, multi-unit ownership (FR-PRD-02..04) |
| M5 Leads and partnerships | Covered (core) | `ContactLead*`, `Contact*`, `OrganizationType`, `Partner`, `PartnerIndustry`, `Campagin*`, CRM reports and dashboard | Lead-to-opportunity link rules, ecosystem tag, lab planning scenarios (FR-LED-04, 05, 08) |
| M6 Recruitment and onboarding | Covered (core) | `HRModule/*` (CV, HiringProcess, OnBoarding, Statuses, TypesAndPhases), `HiringRequest*`, `InterviewPhase`, `OnboardingRequirement`, `RequestOnboarding`, hr hiring-process components | Cross-department onboarding checklist with IT and PR items (FR-HR-05) |
| M7 Procurement | Missing | none | All (FR-PRC-01..03) |
| M8 PR events and protocol | Missing | `Announce*` is adjacent, not equivalent | All (FR-EVT-01..03) |
| M9 Document and brand hub | Missing | Per-record attachments only; `CompanyPolicy` model | Central repository, latest-version control, per-unit sections, unit profile (FR-DOC-01..06) |
| M10 Employee directory | Partial | `User`, `UserDetail`, `JobTitle`, `org-chart` component, profile photos | Marketing directory view, certificates for lab staff (FR-EMP-01..03) |
| M11 Dashboards and reports | Partial | `crm/Components/dashboard`, `AdminDashboardController`, `DashboardController`, `ExportExcelService`, manager reports | Single dashboard with unit, product and opportunity filters; monthly, quarterly and six-month reports (FR-DSH-01..06, FR-RPT-01..05) |
| Roles and permissions | Covered | `PermissionGroup`, `Permission`, `UserPermissionGroup`, `CheckModule`, route guards | Role mapping to BRD roles (Section 14) |
| Module enablement (NFR-06) | Covered | `modules`, `company_modules`, `ModuleService`, `/modules` pages | none |

## Next build order (proposal)

Follows the BRD phasing: (1) business-unit weekly plans, product phases, opportunity go/no-go and unified dashboard on top of the existing projects, CRM and report code; (2) meetings and minutes, directory extensions; (3) document hub and onboarding checklist; (4) procurement and PR events.
