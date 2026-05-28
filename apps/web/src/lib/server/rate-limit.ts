import { error } from '@sveltejs/kit';
import { getRedis } from '$lib/server/redis';

/**
 * Redis-backed token-bucket rate limiter.
 *
 * Each bucket is one Redis key storing a JSON-encoded `{tokens, lastRefill}`.
 * The refill + consume operation runs as a single Lua script so the whole
 * read-modify-write is atomic, even with concurrent requests across replicas.
 *
 * Public API (preserved from the Postgres version):
 *   enforceRateLimit(key, config)  → void (throws 429 if exceeded)
 *   take(key, config)              → { allowed, retryAfterSec }
 *   AI_CHAT_LIMIT / AI_AGENT_LIMIT / AI_SEARCH_LIMIT — preset configs
 *
 * The Lua script returns `[allowed, retryAfterSec]`. We use SETEX-style TTL
 * via `PEXPIRE` so abandoned buckets evict themselves — no cron needed.
 */

export interface RateLimitConfig {
  capacity: number;     // burst size
  refillPerSec: number; // sustained rate (tokens per second)
}

// Atomic refill-and-take. KEYS[1] is the bucket key. ARGV: capacity,
// refillPerSec, nowMs. Returns: { allowed (1|0), retryAfterSec (integer) }.
//
// Bucket value is stored as "<tokens>:<lastRefillMs>" — string is cheaper to
// parse than JSON and avoids serializer overhead.
const TAKE_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillPerSec = tonumber(ARGV[2])
local nowMs = tonumber(ARGV[3])

local raw = redis.call('GET', key)
local tokens
local lastRefill

if raw then
  local sep = string.find(raw, ':')
  tokens = tonumber(string.sub(raw, 1, sep - 1))
  lastRefill = tonumber(string.sub(raw, sep + 1))
else
  tokens = capacity
  lastRefill = nowMs
end

-- Refill
local elapsedSec = math.max(0, (nowMs - lastRefill) / 1000)
tokens = math.min(capacity, tokens + elapsedSec * refillPerSec)
lastRefill = nowMs

local allowed = 0
local retryAfterSec = 0
if tokens >= 1 then
  tokens = tokens - 1
  allowed = 1
else
  local deficit = 1 - tokens
  if refillPerSec > 0 then
    retryAfterSec = math.ceil(deficit / refillPerSec)
  else
    retryAfterSec = 60
  end
end

-- Persist with a TTL of ~30 minutes of idle so abandoned buckets evict.
redis.call('SET', key, tostring(tokens) .. ':' .. tostring(lastRefill), 'PX', 1800000)

return { allowed, retryAfterSec }
`;

const RATE_LIMIT_PREFIX = 'rl:';

export async function take(key: string, config: RateLimitConfig): Promise<{ allowed: boolean; retryAfterSec: number }> {
  const redis = getRedis();
  const fullKey = `${RATE_LIMIT_PREFIX}${key}`;
  try {
    const result = (await redis.eval(
      TAKE_SCRIPT,
      1,
      fullKey,
      config.capacity,
      config.refillPerSec,
      Date.now()
    )) as [number, number];
    return { allowed: result[0] === 1, retryAfterSec: result[1] };
  } catch (err) {
    // Redis unreachable — fail open. The alternative is locking the user out
    // because of an infra problem, which is worse UX than letting a few
    // requests through. The error is already logged by the redis client.
    console.warn('[rate-limit] Redis EVAL failed, allowing request:', err);
    return { allowed: true, retryAfterSec: 0 };
  }
}

/**
 * Enforce a rate limit and throw 429 if exceeded.
 * Call at the top of any handler that hits an upstream AI API.
 */
export async function enforceRateLimit(key: string, config: RateLimitConfig): Promise<void> {
  const { allowed, retryAfterSec } = await take(key, config);
  if (!allowed) {
    throw error(429, `Rate limit exceeded. Try again in ${retryAfterSec}s.`);
  }
}

// ── Preset configs ────────────────────────────────────────────────────────────
// Chat-style: low cost, frequent. 30 requests / 5 min sustained, burst of 10.
export const AI_CHAT_LIMIT: RateLimitConfig = { capacity: 10, refillPerSec: 30 / 300 };

// Heavy/agent-style (tag, moderate, nft, creator-insights): rarer, expensive.
// 20 / 5 min sustained, burst of 5.
export const AI_AGENT_LIMIT: RateLimitConfig = { capacity: 5, refillPerSec: 20 / 300 };

// Search: cheap-ish but easy to spam. 60 / 5 min sustained, burst of 15.
export const AI_SEARCH_LIMIT: RateLimitConfig = { capacity: 15, refillPerSec: 60 / 300 };
