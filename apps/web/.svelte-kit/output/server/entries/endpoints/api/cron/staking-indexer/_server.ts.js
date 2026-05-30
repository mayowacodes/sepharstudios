import { n as public_env, t as private_env } from "../../../../../chunks/shared-server.js";
import { X as stcStakes, _ as cronState, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { createPublicClient, formatUnits, http, isAddress, parseAbi } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
//#region src/routes/api/cron/staking-indexer/+server.ts
/**
* POST /api/cron/staking-indexer
*
* Polling indexer for STCToken stake state. Reads `TokensStaked` and
* `TokensUnstaked` event logs since the last indexed block, then for each
* affected address calls `getStakingInfo(addr)` and upserts the current row.
*
* Why polling instead of an event subscription? Subscriptions need a WSS RPC
* and a long-lived process; we already pay for shared HTTPS RPCs and run
* everything as stateless cron. Polling every 5 minutes gives us a fresh
* enough view for the tokenomics dashboard, and `getStakingInfo` returns
* authoritative current state, so we don't have to replay history.
*
* Auth: same `CRON_SECRET` bearer model as the other cron endpoints.
*
* If the STC token contract / RPC isn't configured, the endpoint reports
* `skipped: true` with the missing pieces. That's the honest empty-state
* path — tokenomics keeps its 0/0/0/0 until the indexer can actually read.
*/
var STC_STAKING_ABI = parseAbi([
	"event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod)",
	"event TokensUnstaked(address indexed user, uint256 amount)",
	"function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)"
]);
var JOB_KEY = "staking-indexer";
var MAX_BLOCK_RANGE = 10000n;
function resolveChain() {
	const network = (private_env.STC_NETWORK ?? "amoy").toLowerCase();
	if (network === "polygon" || network === "mainnet") return {
		chain: polygon,
		rpcUrl: private_env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_POLYGON
	};
	return {
		chain: polygonAmoy,
		rpcUrl: private_env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
		tokenAddress: public_env.PUBLIC_STC_TOKEN_AMOY
	};
}
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const { chain, rpcUrl, tokenAddress } = resolveChain();
	if (!tokenAddress || !isAddress(tokenAddress)) return json({
		ok: true,
		skipped: true,
		reason: "STC token address not configured (set PUBLIC_STC_TOKEN_AMOY or PUBLIC_STC_TOKEN_POLYGON)."
	});
	const client = createPublicClient({
		chain,
		transport: http(rpcUrl)
	});
	const stateRow = await db.select().from(cronState).where(eq(cronState.jobKey, JOB_KEY)).then((r) => r[0]);
	const head = await client.getBlockNumber();
	const fromBlock = stateRow?.lastBlock ? BigInt(stateRow.lastBlock) + 1n : head > 43200n ? head - 43200n : 0n;
	const toBlock = head - fromBlock > MAX_BLOCK_RANGE ? fromBlock + MAX_BLOCK_RANGE : head;
	if (toBlock < fromBlock) return json({
		ok: true,
		skipped: true,
		reason: "No new blocks since last run",
		head: head.toString()
	});
	const stakedLogs = await client.getLogs({
		address: tokenAddress,
		event: STC_STAKING_ABI[0],
		fromBlock,
		toBlock
	});
	const unstakedLogs = await client.getLogs({
		address: tokenAddress,
		event: STC_STAKING_ABI[1],
		fromBlock,
		toBlock
	});
	const affected = /* @__PURE__ */ new Set();
	for (const l of stakedLogs) if (l.args.user) affected.add(l.args.user.toLowerCase());
	for (const l of unstakedLogs) if (l.args.user) affected.add(l.args.user.toLowerCase());
	const now = /* @__PURE__ */ new Date();
	let upserts = 0;
	const errors = [];
	for (const addr of affected) try {
		const [amount, stakingTime, lockPeriod, discountTier, isUnlocked] = await client.readContract({
			address: tokenAddress,
			abi: STC_STAKING_ABI,
			functionName: "getStakingInfo",
			args: [addr]
		});
		await db.insert(stcStakes).values({
			userAddress: addr,
			amount: formatUnits(amount, 18),
			stakingTime: Number(stakingTime),
			lockPeriod: Number(lockPeriod),
			discountTier: Number(discountTier),
			isUnlocked,
			lastSyncedAt: now
		}).onConflictDoUpdate({
			target: stcStakes.userAddress,
			set: {
				amount: formatUnits(amount, 18),
				stakingTime: Number(stakingTime),
				lockPeriod: Number(lockPeriod),
				discountTier: Number(discountTier),
				isUnlocked,
				lastSyncedAt: now
			}
		});
		upserts += 1;
	} catch (err) {
		errors.push(`${addr}: ${err instanceof Error ? err.message : String(err)}`);
	}
	await db.insert(cronState).values({
		jobKey: JOB_KEY,
		lastBlock: toBlock.toString(),
		lastRunAt: now,
		notes: `${stakedLogs.length} staked + ${unstakedLogs.length} unstaked across blocks ${fromBlock}-${toBlock}`
	}).onConflictDoUpdate({
		target: cronState.jobKey,
		set: {
			lastBlock: toBlock.toString(),
			lastRunAt: now,
			notes: `${stakedLogs.length} staked + ${unstakedLogs.length} unstaked across blocks ${fromBlock}-${toBlock}`
		}
	});
	return json({
		ok: true,
		runAt: now.toISOString(),
		network: chain.name,
		fromBlock: fromBlock.toString(),
		toBlock: toBlock.toString(),
		stakedEvents: stakedLogs.length,
		unstakedEvents: unstakedLogs.length,
		uniqueAddresses: affected.size,
		upserts,
		errors
	});
};
//#endregion
export { POST };
