# BMS test environment

## Recorded baseline (11 November 2026)

- PHP 8.1.34 (WebAssembly build used only because the sandbox has no native PHP), Node 22.22.3, npm 10.9.8, Composer 2.11.2.
- `npm ci --legacy-peer-deps` completed; the legacy `@angular/fire` peer range requires this flag.
- Composer installation completed with `--ignore-platform-req=php`: the locked `tymon/jwt-auth 1.0.1` and `lcobucci/jwt 3.4.6` declare PHP 7-only constraints. This is a recorded release risk, not a claim of native PHP 8 compatibility.
- Baseline PHPUnit: 55 tests, 46 passed, 4 errors and 5 failures. Three BMS tests omitted the second migration; five legacy module tests still expected six modules.
- After `BmsTestCase` and stale-test fixes: **55 tests, 245 assertions, all passing on SQLite**.

`BmsTestCase` builds the legacy dependencies, runs both BMS migrations, seeds BMS, enables the real `bms` company module, and issues real JWTs. HTTP tests use `/api/bms/*`, not controller calls. `phpunit.mysql.xml` selects MySQL through `BMS_TEST_DB_CONNECTION`; CI starts MySQL 8. No MySQL server or Chrome is available in this sandbox, so those executions must be read from CI rather than inferred from SQLite or static tests.

## Commands

```bash
cd backend
composer test
composer lint
composer analyse
vendor/bin/phpunit -c phpunit.mysql.xml

cd frontend
npm ci --legacy-peer-deps
npx ng test --watch=false --browsers=ChromeHeadless
npx ng build --configuration production
```

PHPStan runs single-process in the sandbox (`--debug`) because PHP-WASM cannot host its worker socket. The repository's GitHub Actions workflow is the native PHP 8.1 + MySQL 8 + Node 20 release gate.
