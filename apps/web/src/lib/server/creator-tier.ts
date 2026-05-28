import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import {
	createPublicClient,
	http,
	isAddress,
	parseAbi,
	type Address
} from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

/**
 * Source of truth for a creator's tier + revenue share is the
 * `CreatorPayments` smart contract: `getCreatorProfile(addr).tier`. Tiers map
 * to revenue shares as defined in `tierRevenueShares` in the Solidity:
 *   0 / 1 = Standard       → 30%
 *   2     = Exclusive      → 40%
 *   3     = TopPerformer   → 55%
 *
 * Creators without a linked wallet, or when contract / RPC isn't configured,
 * fall back to the database's `creators.creatorType` value. That fallback is
 * the legacy mirror the on-chain contract is meant to replace; we keep it so
 * the endpoint always returns something usable.
 */

export type CreatorTierName = 'standard' | 'exclusive' | 'top_performer';

export interface CreatorTierResult {
	tier: CreatorTierName;
	revenueSharePct: number;
	source: 'on-chain' | 'database-fallback';
	walletAddress: string | null;
}

const CREATOR_PAYMENTS_ABI = parseAbi([
	'function getCreatorProfile(address creator) view returns (uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct, uint256 totalEarnings, uint256 pendingAmount, bool isActive)'
]);

function resolveChain() {
	const network = (env.STC_NETWORK ?? 'amoy').toLowerCase();
	if (network === 'polygon' || network === 'mainnet') {
		return {
			chain: polygon,
			rpcUrl: env.POLYGON_RPC_URL ?? 'https://polygon-rpc.com',
			contractAddress: publicEnv.PUBLIC_CREATOR_PAYMENTS_POLYGON as Address | undefined
		};
	}
	return {
		chain: polygonAmoy,
		rpcUrl: env.AMOY_RPC_URL ?? 'https://rpc-amoy.polygon.technology',
		contractAddress: publicEnv.PUBLIC_CREATOR_PAYMENTS_AMOY as Address | undefined
	};
}

export function dbCreatorTypeToTier(creatorType: string | null): CreatorTierName {
	if (creatorType === 'top_performer') return 'top_performer';
	if (creatorType === 'exclusive') return 'exclusive';
	return 'standard';
}

export function revenueShareForTier(tier: CreatorTierName): number {
	if (tier === 'top_performer') return 55;
	if (tier === 'exclusive') return 40;
	return 30;
}

function tierIdToName(id: number): CreatorTierName {
	// Solidity enum CreatorTier { None, Standard, Exclusive, TopPerformer } — but
	// some deploys use 0=Standard. Treat 0 and 1 both as Standard, 2 Exclusive,
	// 3 TopPerformer.
	if (id === 3) return 'top_performer';
	if (id === 2) return 'exclusive';
	return 'standard';
}

/**
 * Read tier from the CreatorPayments contract for a creator's wallet, falling
 * back to the DB's `creatorType` mirror when the contract isn't reachable or
 * the creator has no linked wallet.
 */
export async function resolveCreatorTier(opts: {
	walletAddress: string | null;
	dbCreatorType: string | null;
}): Promise<CreatorTierResult> {
	const fallback: CreatorTierResult = {
		tier: dbCreatorTypeToTier(opts.dbCreatorType),
		revenueSharePct: revenueShareForTier(dbCreatorTypeToTier(opts.dbCreatorType)),
		source: 'database-fallback',
		walletAddress: opts.walletAddress
	};

	if (!opts.walletAddress || !isAddress(opts.walletAddress)) return fallback;

	const { chain, rpcUrl, contractAddress } = resolveChain();
	if (!contractAddress || !isAddress(contractAddress)) return fallback;

	try {
		const client = createPublicClient({ chain, transport: http(rpcUrl) });
		const profile = await client.readContract({
			address: contractAddress,
			abi: CREATOR_PAYMENTS_ABI,
			functionName: 'getCreatorProfile',
			args: [opts.walletAddress as Address]
		}) as readonly [number, number, bigint, bigint, bigint, bigint, bigint, boolean];

		const [tierId, , , , , , , isActive] = profile;
		if (!isActive) return fallback; // contract has no record for this address
		const tier = tierIdToName(Number(tierId));
		return {
			tier,
			revenueSharePct: revenueShareForTier(tier),
			source: 'on-chain',
			walletAddress: opts.walletAddress
		};
	} catch {
		return fallback;
	}
}
