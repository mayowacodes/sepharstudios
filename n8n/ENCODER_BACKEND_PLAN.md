# Sephar Encoder Backend Plan

## Recommendation

Use `../encoder/encoder-orchestrator` as the control plane and `../encoder/encoder-service` as the worker/API layer. Use n8n only for glue tasks: admin notifications, low-volume webhook bridging, polling, and back-office automation.

n8n should not own the core video lifecycle. Encoding is long-running, CPU-heavy, retry-sensitive work. The existing encoder already has the pieces that matter for a streaming backend: signed uploads, server-controlled object paths, a state machine, Redis queue workers, FFmpeg HLS output, MinIO storage, and Bunny CDN playback signing.

## Current Encoder Shape

- `encoder-orchestrator` exposes:
  - `POST /v1/jobs` to create a job and return a presigned upload URL.
  - `POST /v1/jobs/:jobId/commit` to verify the upload and submit to the encoder API.
  - `GET /v1/jobs/:jobId` to read lifecycle state.
  - `POST /v1/jobs/:jobId/playback` to generate signed playback URLs.
  - `POST /v1/jobs/:jobId/status` for worker callbacks.
- `encoder-service` exposes:
  - `POST /v1/encode` for orchestrator-submitted encode jobs.
  - A Bull/Redis worker that downloads from MinIO, runs FFmpeg, creates HLS playlists/segments, uploads output, and calls the orchestrator back.

## Netflix-Like Backend Flow

1. Creator starts upload in Sephar Studios.
2. Sephar backend calls orchestrator `POST /v1/jobs`.
3. Browser uploads the video directly to the presigned MinIO/S3 URL.
4. Sephar backend calls orchestrator `POST /v1/jobs/:jobId/commit`.
5. Orchestrator verifies the object and submits `/v1/encode` to the encoder service.
6. Worker encodes HLS variants and uploads `master.m3u8` plus variant playlists/segments.
7. Worker calls orchestrator status callbacks: `ENCODING`, `PACKAGING`, `READY`, or `FAILED`.
8. Sephar backend stores `encoderJobId` and processing status against the content record.
9. Watch page requests a signed playback URL only after access checks pass.

## Where n8n Fits

The importable workflow in `n8n/sephar-encoder-orchestration.json` provides:

- A webhook to create an orchestrator job and return the presigned upload URL.
- A webhook to commit an uploaded job.
- A scheduled poller to check pending Sephar jobs and mark ready items back in Sephar.

Recommended production use:

- Let the Sephar app call `POST /api/encoder/jobs` when a creator selects a video file.
- Let the browser upload directly to the returned `upload.url`.
- Let the Sephar app call `POST /api/encoder/jobs/:jobId/commit` after the upload completes.
- Use n8n mainly for the scheduled "pending jobs -> ready content" poller.

Before using the workflow, set these n8n environment variables:

- `ORCHESTRATOR_BASE_URL`
- `ORCHESTRATOR_API_SECRET`
- `SEPHAR_BACKEND_URL`
- `SEPHAR_BACKEND_TOKEN`

The workflow expects these Sephar backend endpoints:

- `GET /api/encoder/pending`, returning `{ "jobs": [{ "contentId": "...", "jobId": "..." }] }`
- `POST /api/encoder/ready`

The Sephar backend also exposes these creator-facing endpoints:

- `POST /api/encoder/jobs`
- `GET /api/encoder/jobs/:jobId`
- `POST /api/encoder/jobs/:jobId/commit`
- `POST /api/encoder/jobs/:jobId/playback`

## Better Long-Term Shape

For production, implement the upload/commit/status bridge inside the SvelteKit backend instead of relying on n8n:

- `POST /api/encoder/jobs`
- `POST /api/encoder/jobs/:jobId/commit`
- `GET /api/encoder/jobs/:jobId`
- `POST /api/encoder/jobs/:jobId/playback`
- Optional internal callback endpoint if you want the app notified directly.

Keep n8n for creator/admin notifications, Slack/email alerts, failed encode escalation, weekly encoding reports, and manual remediation workflows.

## Gaps To Close

- Add auth/rate limiting around `encoder-service` public endpoints.
- Normalize profile mapping. The orchestrator uses `vod-1080p`, `vod-720p`, `vod-480p`, and `vod-multi`; the encoder service currently maps only a few profiles to presets.
- Persist duration and technical metadata after encoding completes.
- Add monitoring for Redis queue depth, worker failures, disk usage, and long-running jobs.
