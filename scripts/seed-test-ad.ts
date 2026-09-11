#!/usr/bin/env bun
/**
 * Seeds a working ad campaign so the squeeze-back can be seen for the first
 * time, without uploading a creative or building the admin flow first.
 *
 *   bun run scripts/seed-test-ad.ts <contentId> [--audio-test]
 *
 * Creates: a house advertiser (reused if present) → an active campaign → a
 * VAST creative pointing at Google's public sample tag → two mid-roll breaks
 * at 60s and 420s.
 *
 * A VAST creative rather than an uploaded file is deliberate: it needs no
 * object in the bucket, so the whole path — auction → VAST fetch → parse →
 * media selection → squeeze → beacons — is exercised end to end on the first
 * try. Swap in a first-party creative once you have one.
 *
 * DELETE THE CAMPAIGN WHEN DONE. It has no flight end date and will keep
 * serving to real viewers:
 *   UPDATE ad_campaigns SET status='completed' WHERE name LIKE 'TEST %';
 */
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const contentId = process.argv[2];
if (!contentId) {
  console.error(
    'Usage: bun run scripts/seed-test-ad.ts <contentId>\n\n' +
      'Find one with:\n' +
      "  SELECT id, title FROM media_library WHERE is_active AND (category IS NULL OR category NOT IN ('kids','teens')) LIMIT 5;"
  );
  process.exit(1);
}

// Google's long-standing public VAST sample. ~10s, so it exercises the DUCK
// path (<= 30s keeps the movie playing at 20% volume).
const SAMPLE_VAST =
  'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

const sql = postgres(databaseUrl, { max: 1 });

try {
  const [content] = await sql<{ id: string; title: string; category: string | null }[]>`
    SELECT id, title, category FROM media_library WHERE id = ${contentId} LIMIT 1
  `;
  if (!content) {
    console.error(`No media_library row with id ${contentId}`);
    process.exit(1);
  }
  // Kids/teens are ad-free platform-wide, so a break there would never serve —
  // fail loudly rather than leave someone puzzling over an empty break.
  if (content.category === 'kids' || content.category === 'teens') {
    console.error(
      `"${content.title}" is category "${content.category}", which is ad-free on every tier. Pick a general-audience title.`
    );
    process.exit(1);
  }

  console.log(`Seeding a test campaign against "${content.title}"…\n`);

  const [advertiser] = await sql<{ id: string }[]>`
    INSERT INTO ad_advertisers (name, slug, kind)
    VALUES ('Sephar Studios (House)', 'sephar-house', 'house')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;
  console.log(`  advertiser  ✓ ${advertiser.id}`);

  const [campaign] = await sql<{ id: string }[]>`
    INSERT INTO ad_campaigns (advertiser_id, name, status, priority, starts_at)
    VALUES (${advertiser.id}, 'TEST squeeze-back', 'active', 90, now() - interval '1 hour')
    RETURNING id
  `;
  console.log(`  campaign    ✓ ${campaign.id}  (status=active, priority=90)`);

  const [creative] = await sql<{ id: string }[]>`
    INSERT INTO ad_creatives (campaign_id, kind, name, vast_tag_url, headline, body, cta_label)
    VALUES (
      ${campaign.id}, 'vast', 'TEST VAST sample', ${SAMPLE_VAST},
      'Sephar Studios', 'Faith-based films, free with ads.', 'Learn more'
    )
    RETURNING id
  `;
  console.log(`  creative    ✓ ${creative.id}  (kind=vast)`);

  // 60s so it fires quickly, 420s to prove the 5-minute minimum gap holds.
  const breaks = await sql<{ id: string; position_seconds: number }[]>`
    INSERT INTO ad_breaks (content_id, position_seconds, kind)
    VALUES (${contentId}, 60, 'midroll'), (${contentId}, 420, 'midroll')
    ON CONFLICT (content_id, position_seconds) DO NOTHING
    RETURNING id, position_seconds
  `;
  for (const b of breaks) console.log(`  break       ✓ ${b.position_seconds}s`);
  if (breaks.length === 0) console.log('  break       — already present, none added');

  console.log(
    [
      '',
      'Now:',
      `  1. Watch the title as a viewer on the FREE tier (basic). Paying tiers get no ads.`,
      '  2. At 60s the movie should scale to 60% and the ad appear in the L.',
      '  3. Open devtools and confirm initSeq stays at 1 — if it increments,',
      '     ad state has leaked into the playback-init effect and HLS is being',
      '     destroyed mid-ad.',
      '',
      'Clean up when finished:',
      `  UPDATE ad_campaigns SET status='completed' WHERE id='${campaign.id}';`,
      `  DELETE FROM ad_breaks WHERE content_id='${contentId}';`
    ].join('\n')
  );
} catch (err) {
  console.error('\nSeeding failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
