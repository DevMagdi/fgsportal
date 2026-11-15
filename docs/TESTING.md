# Alphaiota BMS testing

## React UI

```bash
cd frontend-react
npm ci
npm run typecheck
npm test
npm run build
```

The Node tests cover the identity tokens and original logo, demo persistence and dashboard filtering, API request contracts, permissions, date/time handling and guest validation. The API tests use mocks: they do **not** establish that a real Laravel installation supports every operation. Run the app with `VITE_DEMO_MODE=true npm run dev -- --host 0.0.0.0` for an interactive local demo; use an isolated Laravel environment for real integration and authorization testing.

## Laravel API

```bash
cd backend
composer install
vendor/bin/phpunit                    # SQLite as configured by phpunit.xml
vendor/bin/phpunit -c phpunit.mysql.xml # requires a configured MySQL database
composer lint
composer analyse
```

The repository CI uses PHP 8.1, MySQL 8 and Node 20. Its Composer install currently uses `--ignore-platform-req=php` because some locked dependencies specify older PHP versions. Validate the deployment runtime separately; that flag is not a compatibility guarantee. Database migrations and seeders require review before use against existing data.

Previous test results and their environment constraints are historical, not current passing claims. The detailed [earlier test-environment record](https://github.com/DevMagdi/fgsportal/blob/72953827d23608af32201d03065ef85f08fc5b85/docs/TESTING.md) remains in Git history. See [`../frontend-react/README.md`](../frontend-react/README.md) for known live API gaps.
