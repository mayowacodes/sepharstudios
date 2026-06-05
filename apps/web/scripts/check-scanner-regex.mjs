// Regex coverage check for the scanner-filter array in hooks.server.ts.
// Run with: node apps/web/scripts/check-scanner-regex.mjs
// Exits 0 if every "should match" matches and every "should NOT match" misses;
// exits 1 otherwise. No deploy needed — pure regex test.

const SCANNER_PATTERNS = [
  /^\/config\//,
  /^\/storage\//,
  /^\/var\/log\//,
  /^\/var\/(www|task)\//,
  /^\/logs?\//,
  /^\/(database|dump|backup|db)\.sql$/,
  /^\/\.npmrc$/,
  /^\/\.yarnrc(?:\.yml)?$/,
  /^\/composer\.json$/,
  /^\/\.pypirc$/,
  /^\/\.vscode\//,
  /^\/\.idea\//,
  /^\/\.github\//,
  /^\/\.gitlab-ci\.yml$/,
  /^\/Jenkinsfile$/,
  /^\/(next|nuxt|vite)\.config\.js$/,
  /^\/(firebase|amplify|vercel)\.(json|yml)$/,
  /^\/\.firebase\//,
  /^\/\.env(\.|$)/,
  /^\/aws\.env$/,
  /^\/[^/]+\/\.env(\.|$)/,
  /^\/[^/]+\/env\.js$/,
  /^\/[^/]+\/(?:config\/)?constants?\.js$/,
  /^\/\.git(\/|-?credentials$|$)/,
  /^\/wp-(admin|login|content|includes)\//,
  /^\/wp-config\.php(\.|$)/,
  /^\/wp-login\.php$/,
  /^\/wp-json\//,
  /^\/wp_mail_smtp\.ini$/,
  /^\/(phpmyadmin|pma|adminer)\//,
  /^\/webhooks?(?:-test|-waiting)?(?:\/|$)/,
  /^\/webmin\//,
  /^\/\.aws\//,
  /^\/\.ssh\//,
];

function isScannerPath(pathname) {
  return SCANNER_PATTERNS.some((re) => re.test(pathname));
}

// Paths pulled from the Dokploy log — every one of these SHOULD be filtered.
const shouldMatch = [
  '/var/www/.env',
  '/var/www/html/.env',
  '/var/task/vercel.json',
  '/vercel.json',
  '/wp-login.php',
  '/wp-config.php',
  '/wp-config.php.bak',
  '/wp-config.php.new',
  '/wp-config.php.old',
  '/wp-json/wp/v2/users',
  '/wp-admin/setup-config.php',
  '/wp_mail_smtp.ini',
  '/webhook',
  '/webhook/',
  '/webhook/incoming',
  '/webhook-test/x',
  '/webhook-waiting/x',
  '/webhooks/incoming/stripe.json',
  '/.git/config',
  '/.git-credentials',
  '/.gitcredentials',
  '/aws.env',
  '/.env',
  '/.env.production',
  '/api/.env',
  '/dev/.env',
  '/backend/.env',
  '/core/.env',
  '/member/.env',
  '/web/.env',
  '/website/.env',
  '/app/.env',
  '/new/.env',
  '/webmin/session_login.cgi',
  '/web/env.js',
  '/web/constants.js',
  '/web/constant.js',
  '/web/config/constants.js',
  '/.aws/credentials',
  '/.ssh/id_rsa',
  '/.npmrc',
  '/.yarnrc',
  '/.yarnrc.yml',
  '/composer.json',
  '/.pypirc',
  '/.vscode/settings.json',
  '/.idea/workspace.xml',
  '/.github/workflows/deploy.yml',
  '/.gitlab-ci.yml',
  '/Jenkinsfile',
  '/next.config.js',
  '/nuxt.config.js',
  '/vite.config.js',
  '/firebase.json',
  '/amplify.yml',
  '/.firebase/hosting.json',
  '/config/database.yml',
  '/storage/logs/laravel.log',
  '/var/log/app.log',
  '/logs/error.log',
  '/log/error.log',
  '/database.sql',
  '/dump.sql',
  '/backup.sql',
  '/db.sql',
  '/phpmyadmin/index.php',
  '/pma/index.php',
  '/adminer/',
];

// Real app paths — none of these should be filtered. If any DO match, the
// regex is too broad and a real route would silent-404 in production.
const shouldNotMatch = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/content',
  '/admin/analytics',
  '/admin/tokenomics',
  '/admin/login',
  '/creator',
  '/creator/upload',
  '/creator/dashboard',
  '/creator/stats',
  '/creator/analytics',
  '/creator/earnings',
  '/api/health',
  '/api/auth/signin',
  '/api/users/me',
  '/api/users/me/stc-balance',
  '/api/admin/creators',
  '/api/admin/analytics',
  '/api/admin/tokenomics',
  '/api/creator/stats',
  '/api/creator/upload',
  '/api/creator/analytics',
  '/api/creator/earnings',
  '/api/ai/creator-insights',
  '/api/webhook/stripe',
  '/api/webhooks/stripe',
  '/api/push/subscribe',
  '/watch/abc123',
  '/movies',
  '/shows',
  '/kids',
  '/kids/kiddies',
  '/kids/teens',
  '/profiles',
  '/profiles/select',
  '/account',
  '/access-denied',
  '/offline',
  '/apply/creator',
  '/.well-known/assetlinks.json',
  // Tricky ones — these LOOK like they could match but shouldn't:
  '/api/config',                 // /config/ regex anchors at /config not /api/config
  '/admin/config',               // same — not anchored
  '/creator/env-vars',           // not /.env
  '/api/git-hooks',              // not /.git
  '/api/webhook-handlers/list',  // /webhook regex is anchored at start
];

let pass = 0;
let fail = 0;
const failures = [];

for (const path of shouldMatch) {
  if (isScannerPath(path)) {
    pass++;
  } else {
    fail++;
    failures.push(`  MISS: ${path} should match scanner regex but didn't`);
  }
}

for (const path of shouldNotMatch) {
  if (!isScannerPath(path)) {
    pass++;
  } else {
    fail++;
    const which = SCANNER_PATTERNS.find((re) => re.test(path));
    failures.push(`  OVER-MATCH: ${path} should NOT match but did (${which})`);
  }
}

console.log(`Total: ${pass + fail}  Pass: ${pass}  Fail: ${fail}`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(f);
  process.exit(1);
}
console.log('All regex coverage checks passed.');
