#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSR_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SSR_DIR}/../.." && pwd)"
SRC="${REPO_ROOT}/frontend/.output/server"
DEST="${SSR_DIR}/.nitro-bundle"

if [[ ! -d "${SRC}" ]]; then
  echo "error: missing ${SRC} — run a Nuxt production build in frontend/ first (e.g. pnpm run build)." >&2
  exit 1
fi

rm -rf "${DEST}"
mkdir -p "${DEST}"
# Zip root must contain Nitro entry (e.g. index.mjs) for handler index.handler
cp -R "${SRC}/." "${DEST}/"

echo "Synced Nitro server bundle to ${DEST}"
