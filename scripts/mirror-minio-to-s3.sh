#!/usr/bin/env bash
# Mirror the production MinIO bucket to a managed S3-compatible target.
# Use when migrating from the in-compose MinIO container to Cloudflare R2,
# Backblaze B2, Wasabi or AWS S3.
#
# Prereqs:
#   - mc (MinIO Client) installed: https://min.io/docs/minio/linux/reference/minio-mc.html
#   - Network access to both the source MinIO and the target S3 endpoint.
#
# Usage:
#   bash scripts/mirror-minio-to-s3.sh
#
# Edit the variables below before running. The mirror is non-destructive (no
# deletes on the target) and idempotent — re-run anytime to catch newer objects.

set -euo pipefail

# ── Source: current MinIO (in compose) ────────────────────────────────────────
SRC_ALIAS="prod-minio"
SRC_ENDPOINT="https://s3.sepharstudios.com"
SRC_ACCESS_KEY="${MINIO_ROOT_USER:-sepharadmin}"
SRC_SECRET_KEY="${MINIO_ROOT_PASSWORD:?MINIO_ROOT_PASSWORD must be set in the environment}"

# ── Target: managed S3-compatible (pick one) ──────────────────────────────────
# Examples (uncomment one and fill in):
#
# Cloudflare R2:
#   TARGET_ENDPOINT="https://<account_id>.r2.cloudflarestorage.com"
#   TARGET_ACCESS_KEY="<r2-access-key>"
#   TARGET_SECRET_KEY="<r2-secret-key>"
#
# Backblaze B2:
#   TARGET_ENDPOINT="https://s3.us-west-002.backblazeb2.com"
#   TARGET_ACCESS_KEY="<b2-key-id>"
#   TARGET_SECRET_KEY="<b2-app-key>"
#
# Wasabi:
#   TARGET_ENDPOINT="https://s3.us-east-1.wasabisys.com"
#   TARGET_ACCESS_KEY="<wasabi-key>"
#   TARGET_SECRET_KEY="<wasabi-secret>"

TARGET_ALIAS="new-storage"
TARGET_ENDPOINT="${TARGET_ENDPOINT:?TARGET_ENDPOINT must be set}"
TARGET_ACCESS_KEY="${TARGET_ACCESS_KEY:?TARGET_ACCESS_KEY must be set}"
TARGET_SECRET_KEY="${TARGET_SECRET_KEY:?TARGET_SECRET_KEY must be set}"

BUCKET="${MINIO_BUCKET:-sepharstudios-storage}"

# ── Configure aliases ─────────────────────────────────────────────────────────
mc alias set "$SRC_ALIAS" "$SRC_ENDPOINT" "$SRC_ACCESS_KEY" "$SRC_SECRET_KEY" --api S3v4
mc alias set "$TARGET_ALIAS" "$TARGET_ENDPOINT" "$TARGET_ACCESS_KEY" "$TARGET_SECRET_KEY" --api S3v4

# ── Ensure target bucket exists ───────────────────────────────────────────────
if ! mc ls "$TARGET_ALIAS/$BUCKET" >/dev/null 2>&1; then
  echo "Creating target bucket: $TARGET_ALIAS/$BUCKET"
  mc mb "$TARGET_ALIAS/$BUCKET"
fi

# ── Mirror ────────────────────────────────────────────────────────────────────
# --overwrite copies newer versions on top of older ones.
# --preserve keeps creation timestamps.
echo "Mirroring $SRC_ALIAS/$BUCKET → $TARGET_ALIAS/$BUCKET"
mc mirror --overwrite --preserve "$SRC_ALIAS/$BUCKET" "$TARGET_ALIAS/$BUCKET"

echo ""
echo "Mirror complete. Next steps:"
echo "  1. Verify object counts match:"
echo "     mc ls --recursive $SRC_ALIAS/$BUCKET    | wc -l"
echo "     mc ls --recursive $TARGET_ALIAS/$BUCKET | wc -l"
echo "  2. Update DOKPLOY_ENV.txt:"
echo "     MINIO_ENDPOINT=<target host without protocol>"
echo "     MINIO_PORT=443"
echo "     MINIO_USE_SSL=true"
echo "     MINIO_ACCESS_KEY=<target access key>"
echo "     MINIO_SECRET_KEY=<target secret>"
echo "     MINIO_BUCKET=$BUCKET"
echo "  3. Rebuild + redeploy. The MinIO client library is S3-API compatible —"
echo "     no source code change required."
echo "  4. Run a smoke test: upload a file via /api/files, verify it lands in"
echo "     the target bucket."
echo "  5. Keep the old MinIO running for 24h as fallback."
