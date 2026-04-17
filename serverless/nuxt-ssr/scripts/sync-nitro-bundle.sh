#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSR_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${SSR_DIR}/../.." && pwd)"
SRC="${REPO_ROOT}/frontend/.output/server"
# 作業用: Nitro の .output/server をここに展開する
DEST="${SSR_DIR}/nitro-bundle"
ZIP_OUT="${SSR_DIR}/.lambda-bundle.zip"

if [[ ! -d "${SRC}" ]]; then
  echo "error: missing ${SRC} — run a Nuxt production build in frontend/ first (e.g. pnpm run build)." >&2
  exit 1
fi

rm -rf "${DEST}"
mkdir -p "${DEST}"
cp -R "${SRC}/." "${DEST}/"

# Lambda の zip ルートに index.mjs を置き、handler は index.handler（Nitro / AWS 想定に合わせる）
rm -f "${ZIP_OUT}"
(
  cd "${DEST}"
  zip -qr "${ZIP_OUT}" .
)

echo "Synced Nitro server bundle to ${DEST}/"
echo "Wrote ${ZIP_OUT}"
