#!/bin/bash
set -e

echo "=== Harness Initialization (scentcandlewithVy) ==="

echo "--- Frontend (React + Vite) ---"
(
  cd frontend
  npm install
  npm run lint
  npm run build
)

echo "--- Backend (Express, in-memory — not wired to frontend yet) ---"
(
  cd backend
  npm install
)
echo "Backend package.json 'test' script is a placeholder (always exits 1) — skipping npm test."

echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Read feature-list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on, respecting its 'dependencies'"
echo "3. Implement only that feature"
echo "4. Manually verify in the browser (cd frontend && npm run dev) — no automated UI tests exist yet"
echo "5. Re-run ./init.sh before claiming done"
