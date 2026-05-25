# AI Setup — Sephar Studios (Gemma 4 + Hermes 3 Dual-Model)

## Overview

The platform runs **two local AI models via Ollama** plus **OpenRouter** as a cloud fallback:

| Model | Role | Engine | Cost |
|---|---|---|---|
| **Hermes 3** (`hermes3:8b`) | Structured JSON — tagging, moderation, scoring, NFTs, recommendations | Ollama (local) | **$0** |
| **Gemma 4** (`gemma4:12b`) | Conversational — companion chat, scene insights, narration | Ollama (local) | **$0** |
| **OpenRouter** | Cloud fallback + high-value companion chat | API | ~$0.0002–$0.001/call |

---

## What each model handles

### 🟠 Hermes 3 — Agent Tasks (structured JSON, function-calling grade)
Designed by NousResearch. Specialises in reliable structured output. Handles:

- Content auto-tagging _(every video upload)_
- Search intent classification _(every search)_
- Comment moderation _(every comment submitted)_
- Content pre-screening _(every upload)_
- Review quality scoring → STC reward multiplier _(every review)_
- Watch engagement scoring → token reward decisions _(every watch session)_
- Bot / farming pattern detection _(periodic background scan)_
- NFT metadata generation _(at mint time)_
- Creator analytics insights _(creator dashboard load)_
- Content title optimizer _(creator on-demand)_
- Personalised recommendations _(every homepage load)_

### 🟢 Gemma 4 — Chat Tasks (conversational, faith-aware)
Google's Gemma 4. Specialises in warm, nuanced natural language. Handles:

- Watch Companion chat — "Ask about this movie" _(user-initiated)_
- Scene faith insights — "What's the lesson here?" _(in-player button)_
- NFT portfolio narration _(portfolio page)_
- Blockchain activity feed narration _(activity feed)_

### 🔵 OpenRouter — Cloud Fallback
Used when Ollama is down, or explicitly for the highest-quality companion chat. Falls back automatically — no code changes needed.

> **Fallback chain:** Task calls Hermes or Gemma (local) → if Ollama is down → OpenRouter with matching model type → if no key → fails silently (no crash)

---

## Step-by-step: Activating on your VPS (Dokploy)

### Step 1 — Set environment variables in Dokploy

In Dokploy → your project → **Environment Variables**, add:

```env
# Core Ollama config
OLLAMA_URL=http://ollama:11434
OLLAMA_CHAT_MODEL=gemma4:12b
OLLAMA_AGENT_MODEL=hermes3:8b

# OpenRouter (cloud fallback — optional but recommended)
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENROUTER_CHAT_MODEL=google/gemma-2-27b-it
OPENROUTER_AGENT_MODEL=nousresearch/hermes-3-llama-3.1-405b:extended
```

> **OpenRouter works immediately** after adding the key — no download needed.  
> Ollama models need a manual pull after first deploy (Step 3).

---

### Step 2 — Deploy the stack

Push your code or trigger a redeploy in Dokploy. This starts the `sephar-ollama` container.

The container starts empty (no models). OpenRouter handles all requests in the meantime.

Verify Ollama container is running:
```bash
docker ps | grep ollama
# Expected: sephar-ollama   Up X seconds
```

---

### Step 3 — Pull both AI models

SSH into your VPS and run both pulls (they download into the persistent `ollama-models` volume):

```bash
# Hermes 3 — agent model (~5GB, fast JSON output)
docker exec -it sephar-ollama ollama pull hermes3:8b

# Gemma 4 — chat model (~8GB, warm conversational)
docker exec -it sephar-ollama ollama pull gemma4:12b
```

> **Important:** Models are stored in the `ollama-models` Docker volume — NOT inside the container.  
> They **survive restarts and full redeployments**. You only pull once per model per server.

Time estimate per model: 5–20 minutes depending on VPS bandwidth.

---

### Step 4 — Verify both models are loaded

```bash
docker exec -it sephar-ollama ollama list
```

Expected:
```
NAME           SIZE    MODIFIED
hermes3:8b     4.9 GB  X minutes ago
gemma4:12b     7.7 GB  X minutes ago
```

Quick smoke tests:
```bash
# Test Hermes 3 (agent — should return clean JSON)
docker exec -it sephar-ollama ollama run hermes3:8b \
  "Return ONLY this JSON: {\"verdict\": \"approve\", \"score\": 9}"

# Test Gemma 4 (chat — should return warm natural language)
docker exec -it sephar-ollama ollama run gemma4:12b \
  "Summarise John 3:16 in one warm sentence"
```

---

### Step 5 — Verify from the live app

**Test Hermes 3 (agent/tagging):**
```bash
curl -X POST https://sepharstudios.com/api/ai/tag \
  -H "Content-Type: application/json" \
  -d '{"title": "Redemption Road", "description": "A man broken by addiction finds his way back to God", "contentType": "movie"}'
```
Expected response includes: `"aiProvider": "ollama/hermes3:8b"`

**Test Gemma 4 (companion chat):**
```bash
curl -X POST https://sepharstudios.com/api/ai/companion \
  -H "Content-Type: application/json" \
  -H "Cookie: <your session cookie>" \
  -d '{
    "message": "What is the main theme of this film?",
    "context": {"contentTitle": "Redemption Road", "contentDescription": "Faith journey", "contentType": "movie"},
    "history": []
  }'
```
Expected response includes: `"aiProvider": "openrouter/google/gemma-2-27b-it"` (or `ollama/gemma4:12b` once loaded)

If you see `openrouter/...` instead of `ollama/...` — Ollama is reachable but the model isn't pulled yet. Go back to Step 3.

---

## RAM guide — choosing model sizes

| Your VPS RAM | Hermes 3 | Gemma 4 | Total used |
|---|---|---|---|
| 16 GB | `hermes3:8b` (~5GB) | `gemma4:2b` (~3GB) | ~11GB ✅ |
| 24 GB | `hermes3:8b` (~5GB) | `gemma4:12b` (~8GB) | ~18GB ✅ **Recommended** |
| 32 GB+ | `hermes3:8b` (~5GB) | `gemma4:27b` (~20GB) | ~28GB ✅ Best quality |

Update the env vars in Dokploy to match the size you pull:
```env
OLLAMA_CHAT_MODEL=gemma4:2b    # or gemma4:12b or gemma4:27b
OLLAMA_AGENT_MODEL=hermes3:8b  # 8b is the sweet spot for Hermes 3
```

---

## If a model isn't available in Ollama yet

Search the Ollama library:
```bash
docker exec -it sephar-ollama ollama search hermes
docker exec -it sephar-ollama ollama search gemma
# Or browse: https://ollama.com/library
```

**Temporary workaround:** Leave `OLLAMA_URL` unset. The code automatically routes ALL requests to OpenRouter — `OPENROUTER_AGENT_MODEL` handles structured tasks and `OPENROUTER_CHAT_MODEL` handles chat. When models land in Ollama, add `OLLAMA_URL` back.

---

## OpenRouter models reference

### Chat models (for `OPENROUTER_CHAT_MODEL`)
| Model ID | Notes |
|---|---|
| `google/gemma-2-27b-it` | **Default** — best Gemma-family conversational model |
| `anthropic/claude-3-haiku` | Excellent quality, very affordable |
| `anthropic/claude-3.5-sonnet` | Premium quality |

### Agent models (for `OPENROUTER_AGENT_MODEL`)
| Model ID | Notes |
|---|---|
| `nousresearch/hermes-3-llama-3.1-405b:extended` | **Default** — best Hermes model, highest JSON accuracy |
| `nousresearch/hermes-3-llama-3.1-70b` | Cheaper, still very good |
| `meta-llama/llama-3.1-8b-instruct` | Budget fallback |

Get your key at: **https://openrouter.ai/keys** (free tier with credits included)

---

## Troubleshooting

### Ollama container keeps restarting
```bash
docker logs sephar-ollama --tail 50
```
Usually OOM — not enough RAM. Switch to smaller models or increase VPS RAM.

### `connection refused` on `http://ollama:11434`
Both containers must be on `dokploy-network`:
```bash
docker inspect sephar-ollama | grep -A5 Networks
docker inspect <app-container-id> | grep -A5 Networks
```
Both should show `dokploy-network`.

### App still uses OpenRouter after models are pulled
Restart the app container:
```bash
# In Dokploy UI → Redeploy (no code change needed)
# Or via SSH:
docker restart $(docker ps -q --filter name=sepharstudios)
```

### Swap models without redeploying
```bash
# Pull the new model
docker exec -it sephar-ollama ollama pull gemma4:27b

# Update env var in Dokploy → OLLAMA_CHAT_MODEL=gemma4:27b
# Redeploy app only (Ollama container stays running)
```

### Check which model is actually being used
Every AI response includes an `aiProvider` field:
```json
{ "aiProvider": "ollama/hermes3:8b" }   // ← Hermes local ✅
{ "aiProvider": "ollama/gemma4:12b" }   // ← Gemma local ✅
{ "aiProvider": "openrouter/..." }       // ← cloud fallback (Ollama may be down)
{ "aiProvider": "rule-engine" }          // ← token scoring fallback (both AI down)
```
