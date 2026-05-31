# Encoder Orchestrator Spec — Platform Integration

This document is the complete contract between the platform (this repo) and
the encoder orchestrator + worker service (separate repo at
`Documents/Projects/encoder`). Implement everything in this spec on the
encoder side and the platform integration drops in with zero further
coordination.

It covers two rounds:

1. **R+1 Progress Webhooks** — push job state + percent progress to the
   platform so creators and admins see real progress bars instead of
   "processing…".
2. **R+5 Content Scan** — after transcode, generate a transcript + key-frame
   samples and hand them to the platform. The platform runs AI doctrinal /
   family-safety checks and the admin reviews the result before
   approving content for publication.

Both rounds share the same outbound webhook + HMAC infrastructure.

---

## 1. Shared Infrastructure (build first)

These primitives back both rounds. Once they exist on the orchestrator side,
both R+1 and R+5 are wiring exercises.

### 1.1 Outbound webhook helper

The orchestrator needs to POST to URLs configured by the platform. Build a
small `webhook.send(url, body, opts)` utility that:

- Serializes `body` to JSON.
- Computes `signature = hex(hmac_sha256(secret, raw_body))`.
- Sets headers:
  - `Content-Type: application/json`
  - `X-Encoder-Signature: <signature>`
  - `User-Agent: sephar-encoder/<version>`
- POSTs with a 10-second timeout.
- On non-2xx or network error, retries with exponential backoff:
  `1s → 2s → 4s → 8s → 16s` (5 retries total, ~30s max).
- After final failure, writes the payload to a **dead-letter queue**
  (Postgres table, SQS, or a flat file — anything inspectable) so an
  admin can replay it.

This helper is used by every push the orchestrator makes.

### 1.2 Configuration

Environment variables on the orchestrator:

```
PLATFORM_BASE_URL           = https://sepharstudios.com
PLATFORM_WEBHOOK_SECRET     = <shared HMAC secret>
PLATFORM_PROGRESS_PATH      = /api/encoder/webhook        # R+1
PLATFORM_SCAN_READY_PATH    = /api/encoder/scan-ready     # R+5
ENCODER_VERSION             = 1.2.0
ENCODER_DLQ_DIR             = /var/lib/encoder/dlq        # for failed webhooks
```

The shared secret MUST match what the platform reads from
`ENCODER_WEBHOOK_SECRET`. Rotate by rolling both sides simultaneously.

### 1.3 MinIO upload helper

The orchestrator already produces HLS segments + thumbnails and uploads them
to MinIO. For R+5 it will additionally upload transcripts (.vtt and .txt)
and key-frame JPEG samples to the same bucket structure:

```
{bucket}/encoded/{jobId}/
  ├── master.m3u8                    (existing)
  ├── 1080p/…                        (existing)
  ├── thumb_5s.jpg                   (existing)
  ├── transcript.vtt                 (NEW — R+5)
  ├── transcript.txt                 (NEW — R+5, plain text for AI)
  └── scan-frames/
      ├── frame_001.jpg              (NEW — R+5)
      ├── frame_002.jpg              (NEW — R+5)
      └── … frame_NNN.jpg
```

The platform reads these via the existing public URL pattern; no signed
URLs needed since they're admin-only artifacts.

---

## 2. R+1 — Progress Webhooks

### 2.1 Status state machine

The orchestrator should report these statuses to the platform:

| status | meaning |
| --- | --- |
| `created` | row exists in our DB, no work started yet (current behavior) |
| `queued` | added to the worker queue |
| `running` | actively encoding (any pipeline stage) |
| `ready` | all encoder + scan artifacts present; platform takes over |
| `failed` | unrecoverable error; check `errorMessage` |
| `cancelled` | admin cancelled mid-run via `/api/admin/encoder/jobs/:id/cancel` |

### 2.2 Stages (sub-status during `running`)

Each significant pipeline stage emits a progress webhook. Stage names are
free-text but the platform's UI specifically recognizes:

```
probe                   — ffprobe on source
hls-480                 — generating 480p ladder
hls-720                 — generating 720p ladder
hls-1080                — generating 1080p ladder
hls-1440                — generating 1440p (2K / QHD) ladder
hls-2160                — generating 2160p (4K / UHD) ladder
thumb                   — generating thumbnail timeline
transcript              — Whisper STT (R+5)
scan-frames             — sampling key frames (R+5)
finalize                — uploading master manifest
```

Unknown stages still work — they just render as raw text in the UI.

**Ladder selection rules** — the orchestrator decides which rungs to
generate based on source resolution + the encoder profile passed at job
creation time:

| Profile | Rungs generated |
| --- | --- |
| `vod-480` | 480 only — archive / poor-source content |
| `vod-multi` (default) | 480 + 720 + 1080 — current production default |
| `vod-multi-2k` | 480 + 720 + 1080 + 1440 (source must be ≥ 1440p) |
| `vod-multi-4k` | 480 + 720 + 1080 + 1440 + 2160 (source must be ≥ 2160p) |

**Never up-scale.** If source is 1080p, skip 1440p + 2160p stages even if
the profile asks for them. Jump `progressPct` past those stages so the
platform UI advances correctly.

**Codec note**: for the 2K + 4K rungs, prefer **HEVC (H.265)** or **AV1**
over H.264 — the bandwidth + storage saving is significant at those
resolutions. Master HLS manifest should declare both codecs as alternate
variants so older clients fall back to H.264 lower rungs.

**Storage / bandwidth budget**: a 30-minute 4K HLS ladder is roughly
6-9 GB per video. The platform's MinIO bucket should be sized accordingly
before turning the 4K profile on. Per-creator quota check belongs on the
platform side, not in the orchestrator.

### 2.3 Progress webhook payload

```json
POST /api/encoder/webhook
{
  "jobId": "string (required)",
  "status": "created | queued | running | ready | failed | cancelled",
  "progressPct": 47,            // optional, 0-100
  "stage": "hls-720",           // optional, see 2.2
  "errorMessage": "string"      // required when status='failed'
}
```

### 2.4 Emission rules

- **On stage transition**: emit immediately.
- **During `running`**: emit at least every **5 seconds**, even if `progressPct`
  hasn't changed (keepalive — the platform's idle detection treats stalled
  jobs without updates as "frozen").
- **On `ready`**: emit a final webhook with `progressPct: 100`. (For R+5,
  follow it immediately with the scan-ready webhook described in §3.4.)
- **On `failed`**: include the failure reason in `errorMessage`. Truncate at
  2000 chars.

### 2.5 Computing `progressPct`

The platform doesn't care about the formula, only that it's monotonic
within a single job (never goes backwards) and reaches exactly 100 when
status flips to `ready`. Recommended weighting depends on profile:

**`vod-multi` (480 + 720 + 1080)** — current default:

```
probe        →  0 -  5
hls-480      →  5 - 30
hls-720      → 30 - 55
hls-1080     → 55 - 75
thumb        → 75 - 80
transcript   → 80 - 90      (R+5)
scan-frames  → 90 - 95      (R+5)
finalize     → 95 - 100
```

**`vod-multi-2k` (+ 1440)**:

```
probe        →  0 -  3
hls-480      →  3 - 12
hls-720      → 12 - 25
hls-1080     → 25 - 45
hls-1440     → 45 - 72
thumb        → 72 - 77
transcript   → 77 - 88
scan-frames  → 88 - 93
finalize     → 93 - 100
```

**`vod-multi-4k` (+ 2160)** — 2160p dominates total time:

```
probe        →  0 -  2
hls-480      →  2 -  8
hls-720      →  8 - 16
hls-1080     → 16 - 28
hls-1440     → 28 - 48
hls-2160     → 48 - 78
thumb        → 78 - 82
transcript   → 82 - 90
scan-frames  → 90 - 93
finalize     → 93 - 100
```

Within a stage, use `ffmpeg`'s `-progress pipe:1` output (key
`out_time_us / duration_us`) to interpolate. Read more in the FFmpeg
progress docs.

### 2.6 Cancellation handshake

Today the platform's `/api/admin/encoder/jobs/:id/cancel` endpoint flips
`processingStatus='cancelled'` in our DB but the orchestrator never hears
about it. Add a polling check at the start of every pipeline stage:

```
GET {PLATFORM_BASE_URL}/api/encoder/job-state/:jobId
  Returns: { status: 'cancelled' | 'active' }
```

If cancelled, gracefully shut down the FFmpeg subprocess and emit a final
`status='cancelled'` webhook.

The platform needs to expose `/api/encoder/job-state/:jobId` for this —
flagged in the platform-side TODOs below.

---

## 3. R+5 — Content Scan

### 3.1 When to run

After the encoder finishes producing HLS ladders + thumbnails but **before**
emitting the final `status='ready'` webhook. The scan stage is part of the
"this content is encoded but not yet streamable to viewers" window.

Recommended state model:

```
queued
  → running (stages probe…finalize-ladders)
  → running (stage transcript)
  → running (stage scan-frames)
  → ready  ← platform downstream picks it up here, kicks off AI scan
```

The orchestrator's job ends at `ready`; the platform runs the AI scan
asynchronously after that (described in §3.5).

### 3.2 Transcript generation

Use `faster-whisper` or `whisper.cpp` with the `medium.en` model (good
quality/speed tradeoff for English Christian content) on the source's
**audio track only**. Extract audio first:

```bash
ffmpeg -i source.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav
```

Then transcribe to **two formats**:

- `transcript.vtt` — WebVTT with cue timestamps, identical format to what
  subtitle tracks use. Upload to MinIO at the path in §1.3.
- `transcript.txt` — plain UTF-8 text, one paragraph per Whisper segment,
  no timestamps. Used by the platform's AI checker.

If audio is missing or fails to transcribe, emit `stage='transcript'` with
`progressPct: 90` and proceed; the platform handles missing transcripts
gracefully.

### 3.3 Key-frame sampling

After transcript, sample **15 evenly-spaced frames** from the video. Use
FFmpeg with deterministic timestamps:

```bash
duration_sec=$(ffprobe -i source.mp4 ...)
for i in $(seq 1 15); do
  ts=$(echo "scale=3; $duration_sec * $i / 16" | bc)
  ffmpeg -ss $ts -i source.mp4 -frames:v 1 -q:v 3 \
    -vf "scale=480:-1" scan-frames/frame_$(printf %03d $i).jpg
done
```

Upload all 15 to MinIO at the path in §1.3. JPEG quality 3, max width
480px — keeps each frame under ~80KB.

Skip frames whose visual entropy is near-zero (blank / black screens) and
sample a replacement timestamp ±2% off the original. Don't return fewer
than 15 frames unless the source is shorter than 30 seconds.

### 3.4 Scan-ready webhook

After **both** transcript and frames are uploaded successfully, AND after
the final `progress` webhook with `status='ready'`, POST one more webhook:

```json
POST /api/encoder/scan-ready
{
  "jobId": "string (required)",
  "mediaId": "string (optional; if orchestrator knows it, include it)",
  "transcript": {
    "vttUrl": "https://s3.sepharstudios.com/{bucket}/encoded/{jobId}/transcript.vtt",
    "txtUrl": "https://s3.sepharstudios.com/{bucket}/encoded/{jobId}/transcript.txt",
    "durationSec": 1837,
    "language": "en",
    "wordCount": 4827
  },
  "frames": [
    {
      "index": 1,
      "timestampSec": 122.4,
      "url": "https://s3.sepharstudios.com/{bucket}/encoded/{jobId}/scan-frames/frame_001.jpg"
    },
    … 15 entries total
  ],
  "audioAvailable": true,
  "videoDurationSec": 1837
}
```

This webhook follows the same HMAC signing rules as §2.3.

### 3.5 What happens on the platform side (informational)

After receiving the scan-ready webhook the platform:

1. Stores all artifact URLs in `media_library.content_scan_report`.
2. Sets `content_scan_status = 'in_progress'`.
3. Queues an AI job that:
   - Downloads `transcript.txt`.
   - Runs `moderateContentMetadata()` extended with the transcript text.
   - Optionally calls a vision model on a few flagged frames.
4. Writes the verdict into `content_scan_report.aiVerdict` and sets
   `content_scan_status = 'complete'`.
5. Notifies admin in their abuse-queue-style bell badge.
6. Admin opens the review page and sees the scan report in a banner above
   the Approve / Reject buttons.

Admin still decides. Scan is advisory, never blocking.

---

## 4. Platform-side TODOs (so the orchestrator integration works)

These belong in this repo, listed here so the encoder side knows what to
expect:

- [ ] **Migration 0032** — add `content_scan_report` (jsonb) and
      `content_scan_status` (varchar) columns to `media_library`.
- [ ] **POST `/api/encoder/scan-ready`** — ingest the scan-ready webhook,
      persist the artifact URLs, kick off the AI job.
- [ ] **GET `/api/encoder/job-state/:jobId`** — for the cancellation
      handshake in §2.6.
- [ ] **`lib/server/content-scan.ts`** — pulls the transcript, calls
      `moderateContentMetadata()` with the body, persists verdict.
- [ ] **Admin review page banner** — render scan report (scores, transcript
      excerpts, frame thumbnails grid) above Approve/Reject.
- [ ] **Notify admins** when a new scan completes (mirror the abuse-queue
      bell badge pattern).

All of the above land in the same PR as this spec.

---

## 5. Testing

### 5.1 Encoder-side local smoke test

```bash
# 1. Run the orchestrator locally with PLATFORM_BASE_URL=http://localhost:5173
# 2. Upload a 30-second sample MP4 via the upload wizard.
# 3. Watch the orchestrator logs for stage transitions.
# 4. Confirm progress webhooks reach the platform every ~5s.
# 5. Confirm transcript.vtt + transcript.txt + 15 frame_*.jpg upload to MinIO.
# 6. Confirm scan-ready webhook reaches /api/encoder/scan-ready.
```

### 5.2 Verify the HMAC

A failed signature should produce HTTP 401 from the platform with the body
`{"error":"Invalid signature"}`. Use this curl to test:

```bash
SECRET="dev-secret"
BODY='{"jobId":"test-1","status":"ready","progressPct":100}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

curl -X POST http://localhost:5173/api/encoder/webhook \
  -H "Content-Type: application/json" \
  -H "X-Encoder-Signature: $SIG" \
  -d "$BODY"
```

### 5.3 Verify retry behavior

Block port 5173 with a firewall rule, fire a webhook, confirm the
orchestrator retries with the expected backoff, then unblock and confirm
it lands. Then re-block, fire, wait past max retries, confirm a row lands
in the DLQ.

---

## 6. Out of scope for this spec

The encoder side does NOT need to:

- Run AI models locally — the platform owns all AI.
- Know about user roles, content visibility, or publishing flow.
- Mutate the platform's database — only webhooks.
- Handle creator notifications — the platform fires `notify()` calls.

If the encoder team is tempted to add ML there for "convenience", push back:
keeping the orchestrator stateless about content meaning is what lets us
swap providers, retune prompts, and audit AI spend in one place.

---

## 7. R+6 — Live streaming

Distinct from the VOD pipeline. Same shared infrastructure (HMAC, MinIO).

### 7.1 RTMP ingest

The orchestrator runs an RTMP ingest server (nginx-rtmp / SRS / OvenMediaEngine).
On a new RTMP connection:

1. Read the stream key from the URL (`rtmp://host/app/<streamKey>`).
2. **Validate the key** against the platform:

   ```http
   GET {PLATFORM_BASE_URL}/api/encoder/live-state/validate?streamKey=<key>
   Returns: { valid: bool, streamId?, creatorId? }
   ```

   If invalid → disconnect immediately.

3. **Begin LL-HLS production** at ~3-second target latency. Generate:

   - `master.m3u8` with rungs 360p / 720p / 1080p (configurable per env).
   - 1-second segments + part files (LL-HLS partial segments).
   - Upload to MinIO at `live/{streamKey}/...`.

4. POST to `/api/encoder/live-state`:

   ```json
   {
     "streamKey": "...",
     "status": "ingest",
     "playbackUrl": "https://s3.../live/{streamKey}/master.m3u8"
   }
   ```

5. Once the first segment is uploaded and stable, transition `status` to
   `live`.

### 7.2 Viewer count

The orchestrator counts unique IPs hitting the MinIO playlist endpoint per
60-second window. Every 10 seconds, POST current count:

```json
{ "streamKey": "...", "viewerCount": 137 }
```

### 7.3 RTMP disconnect

When the source disconnects (creator closes OBS), transition:

```text
status: 'ending'  → grace 10s in case of reconnect
status: 'ended'   → finalize, archive recording
```

### 7.4 Recording → VOD

After the stream ends, the orchestrator concatenates segments into an MP4
recording, runs it through the VOD pipeline (HLS ladder + transcript +
content scan exactly as in R+5), and produces a `media_library` row by
POSTing to the existing `/api/encoder/jobs` flow.

When ready, push back:

```json
{
  "streamKey": "...",
  "status": "ended",
  "recordingMediaId": "<media_library.id>"
}
```

The platform then surfaces the recording on the creator's content library
as a normal VOD row.

### 7.5 Configuration additions

```env
LIVE_RTMP_INGEST_HOST     = rtmp://live.sepharstudios.com/app
LIVE_HLS_TARGET_LATENCY   = 3            (seconds)
LIVE_RUNGS                = 360,720,1080
LIVE_RECORDING_ENABLED    = true
```
