import { g as getRedis } from './redis-B0W1dNO5.js';
import { e as error } from './index-Cv5VcsYq.js';

//#region src/lib/server/rate-limit.ts
var TAKE_SCRIPT = `
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
var RATE_LIMIT_PREFIX = "rl:";
async function take(key, config) {
	const redis = getRedis();
	const fullKey = `${RATE_LIMIT_PREFIX}${key}`;
	try {
		const result = await redis.eval(TAKE_SCRIPT, 1, fullKey, config.capacity, config.refillPerSec, Date.now());
		return {
			allowed: result[0] === 1,
			retryAfterSec: result[1]
		};
	} catch (err) {
		console.warn("[rate-limit] Redis EVAL failed, allowing request:", err);
		return {
			allowed: true,
			retryAfterSec: 0
		};
	}
}
/**
* Enforce a rate limit and throw 429 if exceeded.
* Call at the top of any handler that hits an upstream AI API.
*/
async function enforceRateLimit(key, config) {
	const { allowed, retryAfterSec } = await take(key, config);
	if (!allowed) throw error(429, `Rate limit exceeded. Try again in ${retryAfterSec}s.`);
}
var AI_CHAT_LIMIT = {
	capacity: 10,
	refillPerSec: 30 / 300
};
var AI_AGENT_LIMIT = {
	capacity: 5,
	refillPerSec: 20 / 300
};
var AI_SEARCH_LIMIT = {
	capacity: 15,
	refillPerSec: 60 / 300
};

export { AI_AGENT_LIMIT as A, AI_CHAT_LIMIT as a, AI_SEARCH_LIMIT as b, enforceRateLimit as e, take as t };
//# sourceMappingURL=rate-limit-C3y7GHEd.js.map
