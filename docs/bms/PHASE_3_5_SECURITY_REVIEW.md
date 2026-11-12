# BMS Phase 3.5 — Security and authorization review

**Starting SHA:** `ae790a960bf52cda08f0047a43de896ea0972145`  
**Candidate SHA:** `7de9f0479c75269c658bf80772e2ddd343fe29c9`  
**Status:** Targeted code review; security gate **NOT PASSED** due unresolved shared-product audit-scope semantics and no live integration.

## Reviewed boundaries

- `backend/app/Services/BMS/BmsAccess.php`: existing role abilities, global scope role list, unit visibility, `authorizeUnit`, role escalation/assignment restrictions.
- `backend/app/Http/Controllers/BMS/ExecutiveDashboardController.php`: validates existing filters, authorizes selected unit/opportunity, filters visible units, tasks, opportunities, products, procurement and meetings; recent activity suppresses unresolved records.
- `EmployeeController`: employee visibility, manager validation, role authorization, import preview. Manager persistence fix is applied only after existing `validatedManagerId` checks; no role or unit policy changed.
- `ProductTrackingController`: product metadata is validated and unit authorization occurs before writes. The metadata fix writes only the already validated attributes; no auth rule changed.
- Frontend dashboard permission-driven controls were reviewed; browser scenario evidence uses mocked API responses and is not a server authorization test.

## Scenario evidence

| Scenario | Evidence | Outcome / limits |
|---|---|---|
| Authorized selected business unit | CI focused P22 test passed on preceding code baseline; latest CI for candidate pending at report preparation. | Selected-unit activity query regression has an automated check. Not yet a final-CI pass on candidate SHA. |
| Cross-unit activity | P19 test explicitly asserts another unit's event is absent; CI regression previously passed. | The test does not settle event visibility for one Product attached to multiple units. |
| Global permissions | Static review: `visibleUnitIds()` returns null for configured global-scope roles; controller applies global scope and selected unit authorization. | No new global bypass was added. Full role matrix not exhaustively rerun in this session. |
| Restricted dashboard permissions | Chromium mocked browser QA hid controls/panels for a restricted ability set. | Mocked UI evidence only; real endpoint authorization remains unverified. |
| No required permission | Middleware/`BmsAccess` inspected, but no complete matrix of denied HTTP requests was run on candidate SHA. | Not fully verified. |
| Shared product across units | `recentActivity` resolves a Product to every related unit and permits the event if its unit set intersects the viewer scope. | **Unresolved security boundary.** PR review flags possible cross-unit disclosure because audit rows lack the originating-unit snapshot. Do not alter semantics without approval and an explicit business rule. |
| Deleted/unresolved auditable model | Code suppresses records with no resolvable unit, including for global users; P20 test exists and focused CI step previously passed. | Candidate run confirmation required. |

## Confirmed risks / no unauthorized behavior change

1. **High — shared Product audit event scope is ambiguous.** An audit event does not store the unit in which the action occurred. Resolving scope from all current product-unit pivots may expose an event to another unit that shares the Product. The existing P22 and P19 assertions do not fully define the expected cross-unit behavior. This needs explicit security/product approval before any change.
2. **High — company/unit schema contract unresolved.** Employee import conditionally queries `business_units.company_id`, but no such column was found in checked-in migrations. MySQL import tests return 500; reviewer output reports unknown `company_id`. Removing the predicate can weaken tenant boundaries; adding a column/migration invents ownership semantics. No change made; obtain schema and contract decision.
3. **Medium — test suites are not green.** Failures include meeting attendee update and import error responses. The meeting bug appears unrelated legacy code; no workflow behavior was changed.

The changes made in this stabilization candidate do **not** modify role abilities, global roles, unit-scope resolution, endpoints, or business workflows. They persist validated product metadata and manager IDs after existing validation; the date-only fix is presentation-only. No credentials or production data were accessed.

## Security gate

**NOT PASSED.** Focused regression evidence is useful but not sufficient for production acceptance. Need the candidate CI results, real isolated backend authorization matrix, explicit shared-product audit event policy, tenant/company-to-unit schema contract, and live integration against an isolated test database. No Phase 4 work started.