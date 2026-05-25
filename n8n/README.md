# Importing The Encoder Workflow Into n8n

Use `sephar-encoder-orchestration.json` only as an automation layer around the encoder. The core upload, commit, and playback flow should go through the Sephar backend and encoder orchestrator.

## Import

1. Open n8n.
2. Go to **Workflows**.
3. Choose **Import from file**.
4. Select `n8n/sephar-encoder-orchestration.json`.
5. Set the environment variables below.
6. Save and activate the workflow.

## Environment Variables

Set these in your n8n deployment:

```bash
ORCHESTRATOR_BASE_URL=https://your-orchestrator-domain
ORCHESTRATOR_API_SECRET=your-orchestrator-api-secret
SEPHAR_BACKEND_URL=https://your-sephar-app-domain
SEPHAR_BACKEND_TOKEN=your-shared-internal-token
```

Set the same backend token in the Sephar app:

```bash
SEPHAR_BACKEND_TOKEN=your-shared-internal-token
```

## What To Use

The scheduled polling part is the important production path:

- `GET /api/encoder/pending`
- `GET /v1/jobs/:jobId`
- `POST /v1/jobs/:jobId/playback`
- `POST /api/encoder/ready`

The create and commit webhooks are useful for testing or external tools, but the main Sephar creator upload flow should call the Sephar backend directly.
