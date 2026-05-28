# Dump the production Postgres database to a local file. Used as the first
# step when migrating from the current 213.136.92.11 instance to a managed
# provider (Supabase, Neon, Railway, RDS).
#
# Usage (from project root):
#   .\scripts\dump-prod-postgres.ps1                        # default filename
#   .\scripts\dump-prod-postgres.ps1 -OutFile sephar.sql    # custom filename
#
# Requirements:
#   - pg_dump installed locally (matching the prod server's major version).
#     On Windows, install via the PostgreSQL installer; pg_dump.exe ends up
#     in C:\Program Files\PostgreSQL\17\bin (adjust major version).
#   - DATABASE_URL env var set, OR use the embedded default below.

param(
  [string]$OutFile = "sepharstudios-$(Get-Date -Format yyyyMMdd-HHmm).sql"
)

$ErrorActionPreference = "Stop"

$DatabaseUrl = $env:DATABASE_URL
if (-not $DatabaseUrl) {
  Write-Host "DATABASE_URL not set. Read it from apps/web/.env or DOKPLOY_ENV.txt." -ForegroundColor Yellow
  $DatabaseUrl = Read-Host "Paste DATABASE_URL"
}

if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
  Write-Host "pg_dump not on PATH. Install PostgreSQL client tools or add the install dir to PATH." -ForegroundColor Red
  exit 1
}

Write-Host "Dumping to $OutFile…" -ForegroundColor Cyan

# --no-owner / --no-acl strip ownership so the dump restores cleanly into a
# new database where the user names differ. --clean adds DROP statements so
# re-running the restore overwrites cleanly during dry runs.
pg_dump `
  --no-owner `
  --no-acl `
  --format=plain `
  --file=$OutFile `
  $DatabaseUrl

if ($LASTEXITCODE -ne 0) {
  Write-Host "pg_dump failed with exit code $LASTEXITCODE" -ForegroundColor Red
  exit $LASTEXITCODE
}

$size = (Get-Item $OutFile).Length / 1MB
Write-Host ("Wrote {0:N1} MB to {1}" -f $size, $OutFile) -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Provision the managed Postgres (Supabase / Neon / Railway / RDS)." -ForegroundColor Gray
Write-Host "  2. Get its connection string (NEW_DATABASE_URL)." -ForegroundColor Gray
Write-Host "  3. Restore:  psql `$env:NEW_DATABASE_URL -f $OutFile" -ForegroundColor Gray
Write-Host "  4. Run drizzle-kit migrate against the new instance to confirm schema parity." -ForegroundColor Gray
Write-Host "  5. Update DATABASE_URL in Dokploy env + redeploy. Keep the old instance running 24h as fallback." -ForegroundColor Gray
