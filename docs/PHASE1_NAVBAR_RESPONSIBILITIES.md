# Phase 1 — NavbarComponent responsibility checklist

Source: `frontend/src/app/components/navbar/navbar.component.{ts,html}` at base `884930a` (deleted in Phase 1).
"Test" names the spec that exercises the new implementation: **S** = `layout/shell-session.service.spec.ts`, **H** = `layout/app-shell.component.spec.ts`, **D** = `layout/app-shell.dom.spec.ts`, **N** = `layout/navigation/nav.registry.spec.ts`.

## Carried over unchanged

| # | Original responsibility (navbar) | New implementation | Test |
|---|---|---|---|
| 1 | Subscribe to `AuthApiService.user`; act only when a user exists | `ShellSessionService.start()`, started by `AppShellComponent.ngOnInit` | S |
| 2 | Auto-login integration: `AppComponent` calls `autoLogin()`, which feeds the same user stream | `AppComponent` is unchanged; the service listens to the same stream | S |
| 3 | Server validation `getCurrentLoggedInUser()`; adopt the server copy of the user | `ShellSessionService.start()` | S |
| 4 | Forced logout on `Token is Expired` (response or error) with snackbar "Session Expired , Please Relogin" | `ShellSessionService.start()` → `logout()` | S |
| 5 | Hard reload when `userData` is missing from localStorage | `ShellSessionService.start()` | not executed (would reload the test page); verified by code comparison, see below |
| 6 | Load permissions `getUserPermissionsByKey`; forced logout on expired token; empty list on other answers; cached fallback on error | `ShellSessionService.start()` | S |
| 7 | `checkIfHasPerm(id)` with loose equality | `ShellSessionService.checkIfHasPerm`; navigation uses `perm()` in `nav.registry.ts` | S, N |
| 8 | `hasPermTOFollowTicket` (permission 2) and `hasPermTOShowSalaries` (permission 1) flags | Replaced by the same permission checks in `nav.registry.ts` | N |
| 9 | `isManager` / `isAdmin` classification | `ShellSessionService.start()` | S |
| 10 | Announcements: load, pick one at random, show dialog, "Ok" marks as viewed | `ShellSessionService.getMyAnnounces/displayNewAnnounce/markAsView` + `AnnouncementDialogComponent` | S |
| 11 | Realtime nav counters `getNavPermsByUserID`; `refresh_required` → `updateNavPerms` → reload | `ShellSessionService.start()` + `countersFrom()` in `nav.util.ts` | S, N (reload itself not executed) |
| 12 | Counter formulas (`totalManageCounter`, `hrCounter`, `totalRequestsCounter`, `totalCRMReqsCounter`, `totalReports`) | `countersFrom()` | S, N |
| 13 | 16 counter badges on groups and links | `badge` fields in `nav.registry.ts`, rendered by `AppSidebarComponent` (checked one by one against the old template) | — |
| 14 | FCM / realtime notifications `getNotificationByUser(key, 0)` | `ShellSessionService.start()` | S |
| 15 | Unread count, four newest items, relative time, "See More" → `/notification` | `AppHeaderComponent` (`unread`, `latestLegacy`, `getTime`) | — |
| 16 | Click a notification: mark seen, then redirect | `ShellSessionService.readThisNotify` | S |
| 17 | Open-to-Work button for `TECHNICAL_TEAM && position != MANAGER`; opens modal `#openToWork` and loads the list | `AppSidebarComponent` button → `AppShellComponent.openToWork()` → `OpenToWorkDialogComponent.getMyOpenToWork()` | H |
| 18 | Open-to-Work create / deactivate | `OpenToWorkDialogComponent.createOpenToWork/deactivateOpenToWork` (code moved verbatim) | — |
| 19 | Logout: remove `bms-language`, `AuthApiService.logout()`, navigate to `/` | `ShellSessionService.logout()`, called from the header user menu | S |
| 20 | User menu: avatar rules (photo, female, default), username, "View Profile" → `/user/:key` | `AppHeaderComponent` (`avatar`, `canViewProfile`) | — |
| 21 | Module entitlement checks `isModuleEnabled(slug)` for menu items | `NavContext.moduleEnabled` → `ModuleService.isModuleEnabled` | N, H |
| 22 | Sidebar links and their visibility rules | `nav.registry.ts` (see `PHASE1_NAV_PARITY_MATRIX.md`) | N |

## Changed on purpose (nothing here is silent)

| # | Before | Now | Why |
|---|---|---|---|
| C1 | Realtime listeners (counters, notifications) and in-flight requests were never unsubscribed; they kept running after logout and were duplicated each time the user stream emitted | They are cancelled when the user stream emits again and when the shell is destroyed | The service is a singleton that outlives the shell; leaking would mix two accounts' data |
| C2 | State lived in the component and vanished with it | `ShellSessionService.stop()` resets the state | Same reason as C1 |
| C3 | The notification bell was rendered only when there were unread items | The bell is always rendered; the badge appears only with unread items | One header with a stable layout; it also hosts BMS alerts |
| C4 | The whole user menu (avatar, username, "View Profile", "Sign Out") was inside `*ngIf="currentUser.accType != AccountTypeEnum.Client"`, so Client accounts had no user menu and no Sign Out control in the header | Client accounts see the user menu with "Sign Out" only. "View Profile" stays hidden for them (`AppHeaderComponent.canViewProfile` keeps the original `accType != Client` rule). Non-Client accounts are unaffected | Intentional UX improvement, **approved by the product owner in the Phase 1 review**. Sign Out calls the same `ShellSessionService.logout()` as for every other account; no route, guard or permission changed |
| C5 | 16 `/bms` links without any check | Shown only with the matching BMS ability | Approved in the Phase 1 audit |
| C6 | Material side menu with handset breakpoint, `drawer.toggle()` button, per-group open flags (`pmOpened`, …) | Shell collapse / mobile drawer, groups expand in `AppSidebarComponent` | This is the layout being replaced |
| C7 | Debug `console.log` calls for the permission answer and the announcement | Removed | Noise only |

## Reload paths (not covered by automated tests)

Both call `window.location.reload()`, which would reload the Karma page, so they are verified by comparing the code instead.

| Path | Navbar (base) | `ShellSessionService` | Same? |
|---|---|---|---|
| Missing `userData` | Inside the user subscription, after the `getCurrentLoggedInUser()` call is issued and before permissions are requested: `if(!localStorage.getItem('userData')){ window.location.reload() }` | Same position, same condition, same call | Yes |
| `refresh_required` | In the `getNavPermsByUserID` listener: `if(!!res.refresh_required){ res.refresh_required = false; this._auth.updateNavPerms(res).finally(()=>{ window.location.reload() }) }`; otherwise the counters are computed | Same condition, same flag reset, same `updateNavPerms(res).finally(...)` reload; otherwise `countersFrom(res)` | Yes |

The part of the second path before the reload (flag reset, `updateNavPerms` call, counters left untouched) is covered by `shell-session.service.spec.ts`. One consequence of change C1: the nav-counter listener is cancelled when the shell is destroyed, so a `refresh_required` flag that arrives after logout no longer reloads the sign-in page. While signed in the behaviour is identical.

## Dead code not carried over

`navLoading` block-UI (never set to true), `totalAdminCounter` (never assigned, always 0), `btnUsers/btnProjects/btnReports` (not referenced by the template), `currentClient`, `iconSideBarVisible`, commented-out blocks.
