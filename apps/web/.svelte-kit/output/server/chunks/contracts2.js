import { n as config, r as getContractAddresses } from "./config.js";
import { a as USDC_ABI, i as TOKEN_AMM_ABI, n as STUDIO_CHAIN_SUBSCRIPTION_ABI, r as STUDIO_CHAIN_TOKEN_ABI, t as CREATOR_PAYMENTS_ABI } from "./abis2.js";
import { formatUnits, isAddress, parseUnits } from "viem";
import { getAccount, getChainId, readContract, writeContract } from "@wagmi/core";
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
