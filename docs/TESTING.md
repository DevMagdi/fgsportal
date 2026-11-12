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

## Native PHP 8.1 runtime (12 November 2026)

`scripts/bootstrap-test-env.sh` cannot finish in a sandbox that blocks GitHub release assets: the
`composer.phar` download redirects to `release-assets.githubusercontent.com`. A native runtime is
available from the npm registry alone and was used for the 12 November execution recorded below:

```bash
npm pack @libphp/amazon-linux-2-v81@0.0.12 && tar -xzf libphp-amazon-linux-2-v81-0.0.12.tgz
PKG="$PWD/package/native"          # php/php (8.1.29 CLI), php/modules/*.so, lib/*.so, php/composer (2.8.10)
rm "$PKG/lib/libsqlite3.so.0"      # use the system SQLite (3.40.1) instead of the bundled 3.7.17
# php.ini in $INI_DIR: extension_dir=$PKG/php/modules plus extension= lines for bcmath, calendar, ctype,
# curl, dom, exif, fileinfo, iconv, intl, mbstring, mysqlnd, pdo, phar, simplexml, sodium, sqlite3,
# tokenizer, xml, xmlwriter, zip, mysqli, pdo_mysql, pdo_sqlite, xmlreader (opcache is not loaded)
php() { env PHPRC="$INI_DIR" LD_LIBRARY_PATH="$PKG/lib" "$PKG/php/php" "$@"; }

cd backend
php "$PKG/php/composer" install --no-interaction --prefer-dist --ignore-platform-req=php
php artisan test
```

The bundled Composer is byte-identical to the official 2.8.10 release asset
(sha256 `28dbb6bd8bef31479c7985b774c130a8bda37dbe63c35b56f6cb6bc377427573`). `composer install`
only installs the versions pinned in `composer.lock`; neither `composer.json` nor the lock changes.

Recorded result on this runtime (SQLite in-memory, PHPUnit 9.5.25): **126 tests, 917 assertions —
114 pass, 12 fail** (5 errors, 7 failures). The failing tests are listed in
`docs/BMS_FINAL_IMPLEMENTATION_AUDIT.md` §1a. MySQL was not exercised.
