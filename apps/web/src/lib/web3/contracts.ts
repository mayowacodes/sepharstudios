import { readContract, writeContract, getAccount, getChainId } from '@wagmi/core'
import { config, getContractAddresses, type SupportedChainId } from './config'
import {
  STUDIO_CHAIN_TOKEN_ABI,
  STUDIO_CHAIN_SUBSCRIPTION_ABI,
  CREATOR_PAYMENTS_ABI,
  TOKEN_AMM_ABI,
  USDC_ABI
} from './abis'
import { parseUnits, formatUnits } from 'viem'

/**
 * Studio Token (STC) contract interactions
 */
export class STCTokenContract {
  private getAddress() {
    const chainId = getChainId(config) as SupportedChainId
    return getContractAddresses(chainId).studioToken
  }

  async balanceOf(address: string): Promise<string> {
    const balance = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    })
    return formatUnits(balance as bigint, 18)
  }

  async getUserDiscount(address: string): Promise<number> {
    const discount = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'getUserDiscount',
      args: [address as `0x${string}`]
    })
    return Number(discount)
  }

  async getStakingInfo(address: string) {
    const stakingInfo = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'getStakingInfo',
      args: [address as `0x${string}`]
    })

    const [amount, stakingTime, lockPeriod, discountTier, isUnlocked] = stakingInfo as [
      bigint,
      bigint,
      bigint,
      bigint,
      boolean
    ]

    return {
      amount: formatUnits(amount, 18),
      stakingTime: Number(stakingTime),
      lockPeriod: Number(lockPeriod),
      discountTier: Number(discountTier),
      isUnlocked
    }
  }

  async stakeForDiscount(amount: string, lockPeriod: number) {
    const account = getAccount(config)
    if (!account.address) throw new Error('No account connected')

    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'stakeForDiscount',
      args: [parseUnits(amount, 18), BigInt(lockPeriod)]
    })
  }

  async unstake() {
    const account = getAccount(config)
    if (!account.address) throw new Error('No account connected')

    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'unstake',
      args: []
    })
  }

  async totalSupply(): Promise<string> {
    try {
      const supply = await readContract(config, {
        address: this.getAddress() as `0x${string}`,
        abi: STUDIO_CHAIN_TOKEN_ABI,
        functionName: 'totalSupply',
        args: []
      })
      return formatUnits(supply as bigint, 18)
    } catch (error) {
      console.error('Error getting total supply:', error)
      // Return fallback value if contract call fails
      return '10000000' // 10M tokens as fallback
    }
  }

  async approve(spender: string, amount: string) {
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'approve',
      args: [spender as `0x${string}`, parseUnits(amount, 18)]
    })
  }

  async allowance(owner: string, spender: string): Promise<string> {
    const allowance = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`]
    })
    return formatUnits(allowance as bigint, 18)
  }

  contractAddress(): string {
    return this.getAddress()
  }
}

/**
 * Sephar Studios Subscription NFT contract interactions
 */
export class SubscriptionContract {
  private getAddress() {
    const chainId = getChainId(config) as SupportedChainId
    return getContractAddresses(chainId).sepharSubscription
  }

  async getSubscriptionStatus(address: string) {
    const status = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'getSubscriptionStatus',
      args: [address as `0x${string}`]
    })

    const [isActive, tokenId, expiryDate] = status as [boolean, bigint, bigint]

    return {
      isActive,
      tokenId: Number(tokenId),
      expiryDate: Number(expiryDate)
    }
  }

  async hasActiveSubscription(address: string) {
    const result = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'hasActiveSubscription',
      args: [address as `0x${string}`]
    })

    const [hasAccess, tier] = result as [boolean, number]

    return {
      hasAccess,
      tier
    }
  }

  async getSubscriptionDetails(tokenId: number) {
    const details = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'getSubscriptionDetails',
      args: [BigInt(tokenId)]
    })

    const [subscriber, tier, amountPaid, startDate, expiryDate, isActive, renewalCount, totalRevenue] =
      details as [string, number, bigint, bigint, bigint, boolean, bigint, bigint]

    return {
      subscriber,
      tier,
      amountPaid: Number(amountPaid), // in USD cents
      startDate: Number(startDate),
      expiryDate: Number(expiryDate),
      isActive,
      renewalCount: Number(renewalCount),
      totalRevenue: Number(totalRevenue)
    }
  }

  async balanceOf(address: string): Promise<number> {
    const balance = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    })
    return Number(balance)
  }

  async mintSubscriptionWithSTC() {
    const account = getAccount(config)
    if (!account.address) throw new Error('No account connected')
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'mintSubscriptionWithSTC',
      args: []
    })
  }

  async getSTCCooldownStatus(address: string) {
    const result = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: STUDIO_CHAIN_SUBSCRIPTION_ABI,
      functionName: 'getSTCCooldownStatus',
      args: [address as `0x${string}`]
    })
    const [secondsRemaining, nextCooldownDays] = result as [bigint, bigint]
    return {
      secondsRemaining: Number(secondsRemaining),
      nextCooldownDays: Number(nextCooldownDays)
    }
  }

  contractAddress(): string {
    return this.getAddress()
  }
}

/**
 * Creator Payments contract interactions
 */
export class CreatorPaymentsContract {
  private getAddress() {
    const chainId = getChainId(config) as SupportedChainId
    return getContractAddresses(chainId).creatorPayments
  }

  async getCreatorProfile(address: string) {
    const profile = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: CREATOR_PAYMENTS_ABI,
      functionName: 'getCreatorProfile',
      args: [address as `0x${string}`]
    })

    return profile as {
      tier: number
      paymentMethod: number
      fiatPct: number
      usdcPct: number
      stcPct: number
      totalEarnings: bigint
      pendingAmount: bigint
      isActive: boolean
    }
  }

  async getContentRevenue(contentId: number) {
    const revenue = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: CREATOR_PAYMENTS_ABI,
      functionName: 'getContentRevenue',
      args: [BigInt(contentId)]
    })

    const [creator, totalRevenue, creatorShare, paidAmount, isFullyPaid] = revenue as [
      string,
      bigint,
      bigint,
      bigint,
      boolean
    ]

    return {
      creator,
      totalRevenue: Number(totalRevenue),
      creatorShare: Number(creatorShare),
      paidAmount: Number(paidAmount),
      isFullyPaid
    }
  }

  async getCreatorContentIds(address: string) {
    const contentIds = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: CREATOR_PAYMENTS_ABI,
      functionName: 'getCreatorContentIds',
      args: [address as `0x${string}`]
    })

    return (contentIds as bigint[]).map(id => Number(id))
  }

  async updateCreatorPaymentMethod(
    paymentMethod: number,
    fiatPct: number,
    usdcPct: number,
    stcPct: number
  ) {
    const account = getAccount(config)
    if (!account.address) throw new Error('No account connected')

    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: CREATOR_PAYMENTS_ABI,
      functionName: 'updateCreatorPaymentMethod',
      args: [account.address, paymentMethod, BigInt(fiatPct), BigInt(usdcPct), BigInt(stcPct)]
    })
  }
}

/**
 * Token AMM contract interactions
 */
export class TokenAMMContract {
  private getAddress() {
    const chainId = getChainId(config) as SupportedChainId
    return getContractAddresses(chainId).tokenAMM
  }

  async getSTCPrice(): Promise<string> {
    const price = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: TOKEN_AMM_ABI,
      functionName: 'getSTCPrice',
      args: []
    })
    return formatUnits(price as bigint, 6) // USDC has 6 decimals
  }

  async getPoolInfo() {
    const poolInfo = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: TOKEN_AMM_ABI,
      functionName: 'getPoolInfo',
      args: []
    })

    const [stcBalance, usdcBalance, totalLiq, currentPrice, revenue] = poolInfo as [
      bigint,
      bigint,
      bigint,
      bigint,
      bigint
    ]

    return {
      stcBalance: formatUnits(stcBalance, 18),
      usdcBalance: formatUnits(usdcBalance, 6),
      totalLiquidity: Number(totalLiq),
      currentPrice: formatUnits(currentPrice, 6),
      monthlyRevenue: formatUnits(revenue, 6)
    }
  }

  async swapSTCForUSDC(stcAmount: string, minUsdcOut: string) {
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: TOKEN_AMM_ABI,
      functionName: 'swapSTCForUSDC',
      args: [parseUnits(stcAmount, 18), parseUnits(minUsdcOut, 6)]
    })
  }

  async swapUSDCForSTC(usdcAmount: string, minStcOut: string) {
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: TOKEN_AMM_ABI,
      functionName: 'swapUSDCForSTC',
      args: [parseUnits(usdcAmount, 6), parseUnits(minStcOut, 18)]
    })
  }

  contractAddress(): string {
    return this.getAddress()
  }

  async addLiquidity(stcAmount: string, usdcAmount: string, minLiquidity: number = 0) {
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: TOKEN_AMM_ABI,
      functionName: 'addLiquidity',
      args: [parseUnits(stcAmount, 18), parseUnits(usdcAmount, 6), BigInt(minLiquidity)]
    })
  }
}

/**
 * USDC contract interactions
 */
export class USDCContract {
  private getAddress() {
    const chainId = getChainId(config) as SupportedChainId
    return getContractAddresses(chainId).usdcToken
  }

  async balanceOf(address: string): Promise<string> {
    const balance = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    })
    return formatUnits(balance as bigint, 6)
  }

  async approve(spender: string, amount: string) {
    return await writeContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [spender as `0x${string}`, parseUnits(amount, 6)]
    })
  }

  async allowance(owner: string, spender: string): Promise<string> {
    const allowance = await readContract(config, {
      address: this.getAddress() as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`]
    })
    return formatUnits(allowance as bigint, 6)
  }
}

// Singleton instances for easy access
export const stcToken = new STCTokenContract()
export const subscriptionContract = new SubscriptionContract()
export const creatorPayments = new CreatorPaymentsContract()
export const tokenAMM = new TokenAMMContract()
export const usdcToken = new USDCContract()

/**
 * Helper function to check if user has any form of access (subscription or staking)
 */
export async function checkUserAccess(address: string) {
  try {
    const [subscriptionStatus, stakingInfo] = await Promise.all([
      subscriptionContract.hasActiveSubscription(address),
      stcToken.getStakingInfo(address)
    ])

    return {
      hasSubscription: subscriptionStatus.hasAccess,
      subscriptionTier: subscriptionStatus.tier,
      stakingDiscount: await stcToken.getUserDiscount(address),
      stakingAmount: stakingInfo.amount,
      hasAccess: subscriptionStatus.hasAccess || Number(stakingInfo.amount) > 0
    }
  } catch (error) {
    console.error('Error checking user access:', error)
    return {
      hasSubscription: false,
      subscriptionTier: 0,
      stakingDiscount: 0,
      stakingAmount: '0',
      hasAccess: false
    }
  }
}

/**
 * Helper function to get user's token balances
 */
export async function getUserBalances(address: string) {
  try {
    const [stcBalance, usdcBalance] = await Promise.all([
      stcToken.balanceOf(address),
      usdcToken.balanceOf(address)
    ])

    return {
      stc: stcBalance,
      usdc: usdcBalance
    }
  } catch (error) {
    console.error('Error getting user balances:', error)
    return {
      stc: '0',
      usdc: '0'
    }
  }
}