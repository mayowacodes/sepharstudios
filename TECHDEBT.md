# Tech debt

Tracked, deferred work. Each item has enough context that someone (or future-us) can pick it up cold without re-investigating.

Format:

```markdown
## Title
- **Why it exists** — what created the debt
- **Symptoms** — what you'd notice as a user / what costs we're paying
- **Proposed fix** — concrete migration steps
- **Scope** — rough effort
- **Risk if we delay** — what gets worse over time
```

---

## Retire legacy encoder + orchestrator Dokploy services (post-cutover cleanup)

- **Why it exists**
  - Track A migrated the encoder pipeline from `encoder-orchestrator` + Bull-on-Redis + the four `encoder-service/*` Node services to a single Temporal workflow + TS worker at `temporal-encoder/worker/` (in the encoder repo). The Temporal cluster compose lives at `temporal-encoder/cluster/`. SvelteKit no longer calls the orchestrator (`encoder-orchestrator.ts` was deleted; all four submit/commit/cancel/retry endpoints + the playback/status/cron endpoints now route through `temporal-client.ts` + `encoder-playback.ts`).
  - The legacy Dokploy services are still running as a rollback insurance — uploads route to Temporal but the old containers cost only memory while idle.

- **Symptoms (today)**
  - Two idle Dokploy services consuming memory + showing up in dashboards as zero-throughput.
  - `apps/web/src/routes/api/encoder/job-state/[jobId]/+server.ts` (the legacy cancel-poll endpoint the old worker.js calls) is dead-code traffic if those containers ever wake up.
  - `apps/web/src/routes/api/cron/encoder-poll/+server.ts` is a no-op kept around so the Dokploy cron schedule doesn't 404.

- **Proposed fix** (do after ~7 days at 100% Temporal traffic with no incidents)
  1. **Backup the orchestrator's Postgres** (`pg_dump`) and archive it for 30 days.
  2. **Stop Dokploy services**: `encoder-orchestrator`, `encoder-service` (api + worker + content-scan + transcription compose). Don't delete the volumes yet.
  3. **Remove SvelteKit endpoints**:
     - `apps/web/src/routes/api/encoder/job-state/[jobId]/+server.ts`
     - `apps/web/src/routes/api/cron/encoder-poll/+server.ts`
     - The Dokploy cron schedule that hit `encoder-poll`.
  4. **Remove env vars** from SvelteKit: `ORCHESTRATOR_BASE_URL`, `ORCHESTRATOR_API_SECRET`, `ENCODER_ORCHESTRATOR_*`, and any encoder-side `REDIS_URL` if Redis isn't used for anything else.
  5. **In the encoder repo** (`Documents/Projects/encoder/`): delete `encoder-orchestrator/` whole repo, `encoder-service/api/`, `encoder-service/worker/`, `encoder-service/content-scan/`, `encoder-service/transcription/index.js` (keep `transcription/transcribe.py` — the new TS worker spawns it).
  6. **After 30 days**: delete the orchestrator Postgres volume.

- **Scope** — ~2 hours total. Mostly Dokploy + git ops.

- **Risk if we delay** — Low. Idle services are cheap. The only ongoing cost is mental: two stacks of code that look load-bearing but aren't.

---

## Orphaned `Movie` / `AudioTrack` / `Subtitle` / `Chapter` / `PlayerSettings` types

- **Why it exists**
  - The video-player consolidation (above, now DONE) deleted `EnhancedVideoPlayer.svelte` + `VideoControls.svelte`. The types those files imported from `apps/web/src/lib/types/types.ts` (`PlayerSettings`, `Chapter`, `Subtitle`, and the `Movie` interface that itself uses `AudioTrack` + `Subtitle`) are now unused. Grep confirms zero non-self references in `apps/web/src/`.
  - Not removed at consolidation time to keep the diff scoped to the player swap.

- **Symptoms (small but real)**
  - 4 dead interface declarations in `types.ts` future maintainers might mistake for "must keep, somewhere uses it."
  - The `Movie` interface in particular is confusingly named: there's nothing on the platform that imports it, but its presence suggests there's a canonical Movie shape when the real canonical is the Drizzle `mediaLibrary` row.

- **Proposed fix**
  1. Delete `Movie`, `PlayerSettings`, `Chapter`, `Subtitle`, and `AudioTrack` from [apps/web/src/lib/types/types.ts](apps/web/src/lib/types/types.ts).
  2. Keep `LibraryItem`, `ContentRating`, `Genre`, `FilterState`, `Notification`, `UserPreferences`, `UserType` (all still used elsewhere).
  3. `UserPreferences.preferredAudioTrack` is a `string` field (track id), not a reference to the `AudioTrack` type — leave it as-is.
  4. `bun run check` 0/0/0 — should still pass.

- **Scope** — 5-minute change, ~30 LoC deleted.

- **Risk if we delay** — Tiny. Just clutter; doesn't block anything.

---

## Robust trailer pipeline — single 720p MP4 encoder job

- **Why it exists**
  - Today's trailer upload is the "lazy" path: the browser PUTs the file as-is to `encoder-output/trailers/<contentId>/...` and the URL is stored on `media_library.trailer_url`. See [api/creator/trailer-upload/sign](apps/web/src/routes/api/creator/trailer-upload/sign/+server.ts) and [.../commit](apps/web/src/routes/api/creator/trailer-upload/commit/+server.ts).
  - This works for the common case where the creator uploads MP4/h264/AAC, because every browser plays that natively in `<video src>`.
  - It does NOT work for ProRes, MKV-with-uncommon-codecs, or 4K-HDR trailers that wouldn't play in a browser. The /sign endpoint rejects those at upload time today with a clear "use MP4" error, but that's a workaround.

- **Symptoms / what we're paying**
  - Creators uploading from a video editor that exports MOV/MKV/HEVC get blocked at submit time instead of having the file silently transcoded.
  - No way to normalize trailer bitrate / resolution platform-wide (a 4K 50 Mbps trailer takes the same bandwidth as the main film).
  - No HLS adaptive bitrate for trailers — a viewer on slow mobile downloads the whole file before playback can start.

- **Proposed fix — single-pass 720p MP4 transcode through the encoder service**
  1. **Encoder orchestrator** ([Documents/Projects/encoder/encoder-service/orchestrator/](Documents/Projects/encoder/encoder-service/orchestrator/) or wherever the orchestrator config lives): add a new preset `mp4-720p` (or `trailer`) that emits a single 720p MP4 file via libx264 + AAC. No HLS ladder, no master playlist — just one MP4.
  2. **Encoder worker** ([Documents/Projects/encoder/encoder-service/worker/worker.js](Documents/Projects/encoder/encoder-service/worker/worker.js)): branch on the preset's `output_kind`. For HLS presets, current code path. For `mp4-720p`, single ffmpeg invocation that writes `trailer.mp4` to `encoder-output/<jobId>/`. Skip the master-playlist build, write a single row to `encoded_variants` with `codec=h264` and `resolution=720p`.
  3. **SvelteKit `/api/encoder/jobs`**: accept an optional `kind: 'main' | 'trailer'` flag. When `kind === 'trailer'`, request preset `mp4-720p` and store the resulting jobId in `media_library.trailer_encoder_job_id` (new column) so progress can be tracked independently of the main video.
  4. **SvelteKit `/api/encoder/webhook`**: branch on `kind` (passed through from job creation). For `kind === 'trailer'`, write the resulting MP4 URL to `media_library.trailer_url` on `ready`, NOT `video_url`. Don't fire the "new release" creator notification for trailer jobs.
  5. **Wizard submit flow**: when a trailer is present, after the main video commit succeeds, call `/api/encoder/jobs` a SECOND time with `kind: 'trailer'`, PUT the trailer source bytes to `encoder-input` (just like the main video), commit. Removes the direct-PUT path in [api/creator/trailer-upload/sign + commit](apps/web/src/routes/api/creator/trailer-upload/sign/+server.ts).
  6. **Cleanup**: delete the trailer-upload sign/commit endpoints once the encoder-job path is live for ≥1 release cycle without regressions. Keep them in a feature flag until then.

- **Scope** — Cross-repo: ~80 lines orchestrator/worker, ~50 lines SvelteKit, ~30 lines DB migration (new column + index). 4-6 hours total including testing.

- **Risk if we delay**
  - Creators hitting "use MP4" errors will pile up support requests.
  - Bandwidth costs scale linearly with the raw trailer files (no resolution normalization).
  - Inconsistency: main video gets adaptive bitrate, trailer doesn't. Users on mobile data may bail on a trailer that takes 30 seconds to start playing.

---

<!-- Add new entries above this line. Keep newest at the top. -->
