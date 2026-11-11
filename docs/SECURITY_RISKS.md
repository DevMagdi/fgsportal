# Security risk register

## P0-7 dependency verification

The vulnerable npm `xlsx` dependency was removed and Excel import/export was migrated to `exceljs` 4.4.0. Angular development build passed after migration, including the shared legacy HTML-table exporter required by non-BMS modules.

`npm audit --omit=dev` still reports **51 findings: 2 low, 24 moderate, 19 high, 6 critical**. Direct high/critical dependency chains include Angular 13, Firebase 8, jsPDF 2.5, mailgun.js and ngx-deploy-ftp. Transitive findings include basic-ftp, protobufjs, form-data and websocket-driver. Fixes require major framework/tool upgrades prohibited by this task, or transitive lockfile updates that need a full compatibility run. These remain release blockers; private file storage, CORS allow-listing and route authorization reduce exposure but do not remove the vulnerabilities.

Composer audit is wired to CI but has not yet produced a reviewed result in this environment. No claim of zero high/critical findings is made.
