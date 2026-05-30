import { n as config, r as getContractAddresses } from "./config.js";
import { formatUnits, isAddress, parseUnits } from "viem";
import { getAccount, getChainId, readContract, writeContract } from "@wagmi/core";
//#region src/lib/web3/abis.ts
var STUDIO_CHAIN_TOKEN_ABI = [
	"function balanceOf(address owner) view returns (uint256)",
	"function totalSupply() view returns (uint256)",
	"function transfer(address to, uint256 amount) returns (bool)",
	"function approve(address spender, uint256 amount) returns (bool)",
	"function allowance(address owner, address spender) view returns (uint256)",
	"function stakeForDiscount(uint256 amount, uint256 lockPeriod)",
	"function addToStake(uint256 additionalAmount)",
	"function unstake()",
	"function getUserDiscount(address user) view returns (uint256)",
	"function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)",
	"function rewardUser(address user, uint256 amount, string memory rewardType)",
	"function userRewardsEarned(address user) view returns (uint256)",
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod)",
	"event TokensUnstaked(address indexed user, uint256 amount)",
	"event RewardClaimed(address indexed user, uint256 amount, string rewardType)"
];
var STUDIO_CHAIN_SUBSCRIPTION_ABI = [
	"function balanceOf(address owner) view returns (uint256)",
	"function ownerOf(uint256 tokenId) view returns (address)",
	"function tokenURI(uint256 tokenId) view returns (string)",
	"function mintSubscription(address subscriber, uint8 tier, uint256 amountPaid, uint256 duration) returns (uint256)",
	"function renewSubscription(address subscriber, uint256 additionalDuration) returns (uint256)",
	"function getSubscriptionStatus(address subscriber) view returns (bool isActive, uint256 tokenId, uint256 expiryDate)",
	"function getSubscriptionDetails(uint256 tokenId) view returns (address subscriber, uint8 tier, uint256 amountPaid, uint256 startDate, uint256 expiryDate, bool isActive, uint256 renewalCount, uint256 totalRevenue)",
	"function hasActiveSubscription(address user) view returns (bool hasAccess, uint8 tier)",
	"function mintSubscriptionWithSTC() returns (uint256)",
	"function getSTCCooldownStatus(address user) view returns (uint256 secondsRemaining, uint256 nextCooldownDays)",
	"function stcSubscriptionAmount() view returns (uint256)",
	"function stcSubUsage(address user) view returns (uint256 redemptionCount, uint256 lastRedemptionTime)",
	"event SubscriptionMinted(address indexed subscriber, uint256 indexed tokenId, uint8 tier, uint256 expiryDate)",
	"event SubscriptionRenewed(address indexed subscriber, uint256 indexed tokenId, uint256 newExpiryDate)",
	"event SubscriptionMintedWithSTC(address indexed subscriber, uint256 indexed tokenId, uint256 stcAmount, uint256 nextCooldownDays)",
	"event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];
var CREATOR_PAYMENTS_ABI = [
	"function registerCreator(address creator, uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct)",
	"function updateCreatorPaymentMethod(address creator, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct)",
	"function getCreatorProfile(address creator) view returns (uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct, uint256 totalEarnings, uint256 pendingAmount, bool isActive)",
	"function recordContentRevenue(uint256 contentId, address creator, uint256 totalRevenue)",
	"function getContentRevenue(uint256 contentId) view returns (address creator, uint256 totalRevenue, uint256 creatorShare, uint256 paidAmount, bool isFullyPaid)",
	"function getCreatorContentIds(address creator) view returns (uint256[])",
	"function processCreatorPayment(address creator)",
	"function batchProcessPayments(address[] calldata creators)",
	"function pendingPayments(address creator) view returns (uint256)",
	"function totalLifetimeEarnings(address creator) view returns (uint256)",
	"event CreatorRegistered(address indexed creator, uint8 tier, uint8 method)",
	"event RevenueRecorded(uint256 indexed contentId, address indexed creator, uint256 amount)",
	"event PaymentProcessed(address indexed creator, uint256 amount, string paymentType)",
	"event FiatPaymentQueued(address indexed creator, uint256 amount)"
];
var TOKEN_AMM_ABI = [
	"function addLiquidity(uint256 stcAmount, uint256 usdcAmount, uint256 minLiquidity) returns (uint256)",
	"function removeLiquidity(uint256 liquidityTokens, uint256 minStc, uint256 minUsdc) returns (uint256 stcAmount, uint256 usdcAmount)",
	"function swapSTCForUSDC(uint256 stcAmountIn, uint256 minUsdcOut) returns (uint256)",
	"function swapUSDCForSTC(uint256 usdcAmountIn, uint256 minStcOut) returns (uint256)",
	"function getSTCPrice() view returns (uint256)",
	"function getStcAmountOut(uint256 usdcAmount) view returns (uint256)",
	"function getPoolInfo() view returns (uint256 stcBalance, uint256 usdcBalance, uint256 totalLiq, uint256 currentPrice, uint256 revenue)",
	"function stcReserve() view returns (uint256)",
	"function usdcReserve() view returns (uint256)",
	"function totalLiquidity() view returns (uint256)",
	"function liquidityProviders(address provider) view returns (uint256)",
	"function executeBuyback(uint256 usdcAmount)",
	"function updatePlatformRevenue(uint256 newRevenue)",
	"function monthlyPlatformRevenue() view returns (uint256)",
	"event LiquidityAdded(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
	"event LiquidityRemoved(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
	"event TokenSwapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
	"event BuybackExecuted(uint256 usdcAmount, uint256 stcAmount)",
	"event RevenueUpdated(uint256 newRevenue, uint256 timestamp)"
];
var USDC_ABI = [
	"function balanceOf(address owner) view returns (uint256)",
	"function totalSupply() view returns (uint256)",
	"function transfer(address to, uint256 amount) returns (bool)",
	"function approve(address spender, uint256 amount) returns (bool)",
	"function allowance(address owner, address spender) view returns (uint256)",
	"function decimals() view returns (uint8)",
	"function symbol() view returns (string)",
	"function name() view returns (string)",
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)"
];
//#endregion
//#region src/lib/web3/contracts.ts
/**
* Validate a contract address is present + well-formed before any call.
* Centralised so we get a clear error instead of cryptic viem failures when
* the relevant CONTRACT_ADDRESSES entry is empty (e.g. contracts not deployed
* to the current chain yet).
*/
function requireAddress(address, contractName) {
	if (!address || !isAddress(address)) throw new Error(`${contractName} address is not configured for this network. Set the matching entry in lib/web3/config.ts CONTRACT_ADDRESSES (or the deploy-time env var) before calling.`);
	return address;
}
/**
* Wrap a contract write so errors carry the contract + function context.
* viem's revert messages are useful but lose track of which surface threw,
* which is annoying when several writes happen back-to-back.
*/
async function withCtx(contractName, fn, op) {
	try {
		return await op();
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(`${contractName}.${fn} failed: ${msg}`);
	}
}
/**
* Studio Token (STC) contract interactions
*/
var STCTokenContract = class {
	getAddress() {
		return requireAddress(getContractAddresses(getChainId(config)).studioToken, "STCToken");
	}
	async balanceOf(address) {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "balanceOf",
			args: [address]
		}), 18);
	}
	async getUserDiscount(address) {
		const discount = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "getUserDiscount",
			args: [address]
		});
		return Number(discount);
	}
	async getStakingInfo(address) {
		const [amount, stakingTime, lockPeriod, discountTier, isUnlocked] = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "getStakingInfo",
			args: [address]
		});
		return {
			amount: formatUnits(amount, 18),
			stakingTime: Number(stakingTime),
			lockPeriod: Number(lockPeriod),
			discountTier: Number(discountTier),
			isUnlocked
		};
	}
	async stakeForDiscount(amount, lockPeriod) {
		if (!getAccount(config).address) throw new Error("No account connected");
		return withCtx("STCToken", "stakeForDiscount", () => writeContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "stakeForDiscount",
			args: [parseUnits(amount, 18), BigInt(lockPeriod)]
		}));
	}
	async addToStake(additionalAmount) {
		if (!getAccount(config).address) throw new Error("No account connected");
		return withCtx("STCToken", "addToStake", () => writeContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "addToStake",
			args: [parseUnits(additionalAmount, 18)]
		}));
	}
	async unstake() {
		if (!getAccount(config).address) throw new Error("No account connected");
		return withCtx("STCToken", "unstake", () => writeContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "unstake",
			args: []
		}));
	}
	async totalSupply() {
		try {
			return formatUnits(await readContract(config, {
				address: this.getAddress(),
				abi: STUDIO_CHAIN_TOKEN_ABI,
				functionName: "totalSupply",
				args: []
			}), 18);
		} catch (error) {
			console.error("Error getting total supply:", error);
			return "10000000";
		}
	}
	async approve(spender, amount) {
		return await writeContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "approve",
			args: [spender, parseUnits(amount, 18)]
		});
	}
	async allowance(owner, spender) {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_TOKEN_ABI,
			functionName: "allowance",
			args: [owner, spender]
		}), 18);
	}
	contractAddress() {
		return this.getAddress();
	}
};
/**
* Sephar Studios Subscription NFT contract interactions
*/
var SubscriptionContract = class {
	getAddress() {
		return requireAddress(getContractAddresses(getChainId(config)).sepharSubscription, "Subscription");
	}
	async getSubscriptionStatus(address) {
		const [isActive, tokenId, expiryDate] = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "getSubscriptionStatus",
			args: [address]
		});
		return {
			isActive,
			tokenId: Number(tokenId),
			expiryDate: Number(expiryDate)
		};
	}
	async hasActiveSubscription(address) {
		const [hasAccess, tier] = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "hasActiveSubscription",
			args: [address]
		});
		return {
			hasAccess,
			tier
		};
	}
	async getSubscriptionDetails(tokenId) {
		const [subscriber, tier, amountPaid, startDate, expiryDate, isActive, renewalCount, totalRevenue] = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "getSubscriptionDetails",
			args: [BigInt(tokenId)]
		});
		return {
			subscriber,
			tier,
			amountPaid: Number(amountPaid),
			startDate: Number(startDate),
			expiryDate: Number(expiryDate),
			isActive,
			renewalCount: Number(renewalCount),
			totalRevenue: Number(totalRevenue)
		};
	}
	async balanceOf(address) {
		const balance = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "balanceOf",
			args: [address]
		});
		return Number(balance);
	}
	async mintSubscriptionWithSTC() {
		if (!getAccount(config).address) throw new Error("No account connected");
		return withCtx("Subscription", "mintSubscriptionWithSTC", () => writeContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "mintSubscriptionWithSTC",
			args: []
		}));
	}
	async getSTCSubscriptionAmount() {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "stcSubscriptionAmount",
			args: []
		}), 18);
	}
	async getSTCCooldownStatus(address) {
		const [secondsRemaining, nextCooldownDays] = await readContract(config, {
			address: this.getAddress(),
			abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
			functionName: "getSTCCooldownStatus",
			args: [address]
		});
		return {
			secondsRemaining: Number(secondsRemaining),
			nextCooldownDays: Number(nextCooldownDays)
		};
	}
	contractAddress() {
		return this.getAddress();
	}
};
/**
* Creator Payments contract interactions
*/
var CreatorPaymentsContract = class {
	getAddress() {
		return requireAddress(getContractAddresses(getChainId(config)).creatorPayments, "CreatorPayments");
	}
	async getCreatorProfile(address) {
		return await readContract(config, {
			address: this.getAddress(),
			abi: CREATOR_PAYMENTS_ABI,
			functionName: "getCreatorProfile",
			args: [address]
		});
	}
	async getContentRevenue(contentId) {
		const [creator, totalRevenue, creatorShare, paidAmount, isFullyPaid] = await readContract(config, {
			address: this.getAddress(),
			abi: CREATOR_PAYMENTS_ABI,
			functionName: "getContentRevenue",
			args: [BigInt(contentId)]
		});
		return {
			creator,
			totalRevenue: Number(totalRevenue),
			creatorShare: Number(creatorShare),
			paidAmount: Number(paidAmount),
			isFullyPaid
		};
	}
	async getCreatorContentIds(address) {
		return (await readContract(config, {
			address: this.getAddress(),
			abi: CREATOR_PAYMENTS_ABI,
			functionName: "getCreatorContentIds",
			args: [address]
		})).map((id) => Number(id));
	}
	async updateCreatorPaymentMethod(paymentMethod, fiatPct, usdcPct, stcPct) {
		const account = getAccount(config);
		if (!account.address) throw new Error("No account connected");
		return await writeContract(config, {
			address: this.getAddress(),
			abi: CREATOR_PAYMENTS_ABI,
			functionName: "updateCreatorPaymentMethod",
			args: [
				account.address,
				paymentMethod,
				BigInt(fiatPct),
				BigInt(usdcPct),
				BigInt(stcPct)
			]
		});
	}
};
/**
* Token AMM contract interactions
*/
var TokenAMMContract = class {
	getAddress() {
		return requireAddress(getContractAddresses(getChainId(config)).tokenAMM, "TokenAMM");
	}
	async getSTCPrice() {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "getSTCPrice",
			args: []
		}), 6);
	}
	async getPoolInfo() {
		const [stcBalance, usdcBalance, totalLiq, currentPrice, revenue] = await readContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "getPoolInfo",
			args: []
		});
		return {
			stcBalance: formatUnits(stcBalance, 18),
			usdcBalance: formatUnits(usdcBalance, 6),
			totalLiquidity: Number(totalLiq),
			currentPrice: formatUnits(currentPrice, 6),
			monthlyRevenue: formatUnits(revenue, 6)
		};
	}
	async swapSTCForUSDC(stcAmount, minUsdcOut) {
		return withCtx("TokenAMM", "swapSTCForUSDC", () => writeContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "swapSTCForUSDC",
			args: [parseUnits(stcAmount, 18), parseUnits(minUsdcOut, 6)]
		}));
	}
	async swapUSDCForSTC(usdcAmount, minStcOut) {
		return withCtx("TokenAMM", "swapUSDCForSTC", () => writeContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "swapUSDCForSTC",
			args: [parseUnits(usdcAmount, 6), parseUnits(minStcOut, 18)]
		}));
	}
	contractAddress() {
		return this.getAddress();
	}
	async addLiquidity(stcAmount, usdcAmount, minLiquidity = 0) {
		return withCtx("TokenAMM", "addLiquidity", () => writeContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "addLiquidity",
			args: [
				parseUnits(stcAmount, 18),
				parseUnits(usdcAmount, 6),
				BigInt(minLiquidity)
			]
		}));
	}
	async removeLiquidity(liquidityTokens, minStcOut, minUsdcOut) {
		return withCtx("TokenAMM", "removeLiquidity", () => writeContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "removeLiquidity",
			args: [
				parseUnits(liquidityTokens, 18),
				parseUnits(minStcOut, 18),
				parseUnits(minUsdcOut, 6)
			]
		}));
	}
	/**
	* Returns the calling user's LP token balance + their share of the pool
	* as a percentage (0–100). Calls `liquidityProviders(addr)` + `totalLiquidity()`.
	*/
	async getMyLPShare(addr) {
		const lp = await readContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "liquidityProviders",
			args: [addr]
		});
		const total = await readContract(config, {
			address: this.getAddress(),
			abi: TOKEN_AMM_ABI,
			functionName: "totalLiquidity"
		});
		return {
			lpAmount: formatUnits(lp, 18),
			sharePct: total > 0n ? Number(lp * 10000n / total) / 100 : 0
		};
	}
};
/**
* USDC contract interactions
*/
var USDCContract = class {
	getAddress() {
		return requireAddress(getContractAddresses(getChainId(config)).usdcToken, "USDC");
	}
	async balanceOf(address) {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: USDC_ABI,
			functionName: "balanceOf",
			args: [address]
		}), 6);
	}
	async approve(spender, amount) {
		return await writeContract(config, {
			address: this.getAddress(),
			abi: USDC_ABI,
			functionName: "approve",
			args: [spender, parseUnits(amount, 6)]
		});
	}
	async allowance(owner, spender) {
		return formatUnits(await readContract(config, {
			address: this.getAddress(),
			abi: USDC_ABI,
			functionName: "allowance",
			args: [owner, spender]
		}), 6);
	}
};
var stcToken = new STCTokenContract();
var subscriptionContract = new SubscriptionContract();
new CreatorPaymentsContract();
var tokenAMM = new TokenAMMContract();
var usdcToken = new USDCContract();
/**
* Helper function to get user's token balances
*/
async function getUserBalances(address) {
	try {
		const [stcBalance, usdcBalance] = await Promise.all([stcToken.balanceOf(address), usdcToken.balanceOf(address)]);
		return {
			stc: stcBalance,
			usdc: usdcBalance
		};
	} catch (error) {
		console.error("Error getting user balances:", error);
		return {
			stc: "0",
			usdc: "0"
		};
	}
}
//#endregion
export { USDCContract as a, subscriptionContract as c, TokenAMMContract as i, tokenAMM as l, STCTokenContract as n, getUserBalances as o, SubscriptionContract as r, stcToken as s, CreatorPaymentsContract as t, usdcToken as u };
