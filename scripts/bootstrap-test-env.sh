#!/usr/bin/env bash
set -euo pipefail

# Reproducible PHP-WASM test runtime for sandboxes without native PHP.
# Sources: npm registry (PHP-WASM packages), GitHub Composer release, then
# the exact package dists pinned by backend/composer.lock.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS="${BMS_TEST_TOOLS:-/tmp/bms-tools}"
PHP_WASM_VERSION="3.1.64"
COMPOSER_VERSION="2.8.12"

mkdir -p "$TOOLS"
if [[ ! -f "$TOOLS/package.json" ]]; then
  (cd "$TOOLS" && npm init -y >/dev/null)
fi
(cd "$TOOLS" && npm install --no-audit --no-fund \
  "@php-wasm/universal@$PHP_WASM_VERSION" \
  "@php-wasm/node@$PHP_WASM_VERSION")

cat > "$TOOLS/php-cli.mjs" <<'JS'
import { PHP } from '@php-wasm/universal';
import { loadNodeRuntime, createNodeFsMountHandler } from '@php-wasm/node';
const php = new PHP(await loadNodeRuntime('8.1', {
  emscriptenOptions: { processId: 1 },
}));
await php.mount('/workspace', createNodeFsMountHandler(process.cwd()));
php.chdir('/workspace');
const response = await php.cli(['php', ...process.argv.slice(2)]);
response.stdout.pipeTo(new WritableStream({ write(chunk) { process.stdout.write(chunk); } }));
response.stderr.pipeTo(new WritableStream({ write(chunk) { process.stderr.write(chunk); } }));
process.exit(await response.exitCode);
JS

if [[ ! -s "$TOOLS/composer.phar" ]]; then
  curl --retry 3 --connect-timeout 15 --max-time 120 -fL \
    "https://github.com/composer/composer/releases/download/$COMPOSER_VERSION/composer.phar" \
    -o "$TOOLS/composer.phar"
fi

cd "$ROOT/backend"
node "$TOOLS/php-cli.mjs" "$TOOLS/composer.phar" install \
  --no-interaction --prefer-dist --ignore-platform-req=php

echo "Run tests with:"
echo "cd '$ROOT/backend' && node '$TOOLS/php-cli.mjs' vendor/bin/phpunit"
