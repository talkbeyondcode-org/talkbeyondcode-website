#!/usr/bin/env bash
# Pin the dev server to a Node >= 20.19 / 22.12 (Vite 8 requirement).
# The machine's default nvm Node is 18.16.1, which Vite rejects, so we put a
# known-good Node 22 first on PATH — this also fixes child processes (vite's
# `#!/usr/bin/env node` shebang resolves to the version below).
set -e

NODE22_BIN="/Users/vivekr_500340/.nvm/versions/node/v22.18.0/bin"
if [ -d "$NODE22_BIN" ]; then
  export PATH="$NODE22_BIN:$PATH"
fi

# Move to the website project root regardless of where we were invoked from.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "dev.sh using node $(node -v)"
exec npm run dev
