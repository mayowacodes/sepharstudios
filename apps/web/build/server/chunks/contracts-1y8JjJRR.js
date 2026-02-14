import { getChainId, readContract, writeContract, getAccount } from '@wagmi/core';
import { c as config, g as getContractAddresses } from './config-Bjr_iq_c.js';
import { formatUnits, parseUnits } from 'viem';

const STUDIO_CHAIN_TOKEN_ABI = [
  // Basic ERC20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  // Staking functions
  "function stakeForDiscount(uint256 amount, uint256 lockPeriod)",
  "function unstake()",
  "function getUserDiscount(address user) view returns (uint256)",
  "function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)",
  // Reward functions
  "function rewardUser(address user, uint256 amount, string memory rewardType)",
  "function userRewardsEarned(address user) view returns (uint256)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod)",
  "event TokensUnstaked(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount, string rewardType)"
];
const TOKEN_AMM_ABI = [
  // Liquidity functions
  "function addLiquidity(uint256 stcAmount, uint256 usdcAmount, uint256 minLiquidity) returns (uint256)",
  "function removeLiquidity(uint256 liquidityTokens, uint256 minStc, uint256 minUsdc) returns (uint256 stcAmount, uint256 usdcAmount)",
  // Trading functions
  "function swapSTCForUSDC(uint256 stcAmountIn, uint256 minUsdcOut) returns (uint256)",
  "function swapUSDCForSTC(uint256 usdcAmountIn, uint256 minStcOut) returns (uint256)",
  "function getSTCPrice() view returns (uint256)",
  // Pool information
  "function getPoolInfo() view returns (uint256 stcBalance, uint256 usdcBalance, uint256 totalLiq, uint256 currentPrice, uint256 revenue)",
  "function stcReserve() view returns (uint256)",
  "function usdcReserve() view returns (uint256)",
  "function totalLiquidity() view returns (uint256)",
  "function liquidityProviders(address provider) view returns (uint256)",
  // Platform functions
  "function executeBuyback(uint256 usdcAmount)",
  "function updatePlatformRevenue(uint256 newRevenue)",
  "function monthlyPlatformRevenue() view returns (uint256)",
  // Events
  "event LiquidityAdded(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
  "event LiquidityRemoved(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)",
  "event TokenSwapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)",
  "event BuybackExecuted(uint256 usdcAmount, uint256 stcAmount)",
  "event RevenueUpdated(uint256 newRevenue, uint256 timestamp)"
];
const USDC_ABI = [
  // Standard ERC20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];
class STCTokenContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).studioToken;
  }
  async balanceOf(address) {
    const balance = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "balanceOf",
      args: [address]
    });
    return formatUnits(balance, 18);
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
    const stakingInfo = await readContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "getStakingInfo",
      args: [address]
    });
    const [amount, stakingTime, lockPeriod, discountTier, isUnlocked] = stakingInfo;
    return {
      amount: formatUnits(amount, 18),
      stakingTime: Number(stakingTime),
      lockPeriod: Number(lockPeriod),
      discountTier: Number(discountTier),
      isUnlocked
    };
  }
  async stakeForDiscount(amount, lockPeriod) {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "stakeForDiscount",
      args: [parseUnits(amount, 18), BigInt(lockPeriod)]
    });
  }
  async unstake() {
    const account = getAccount(config);
    if (!account.address) throw new Error("No account connected");
    return await writeContract(config, {
      address: this.getAddress(),
      abi: STUDIO_CHAIN_TOKEN_ABI,
      functionName: "unstake",
      args: []
    });
  }
  async totalSupply() {
    try {
      const supply = await readContract(config, {
        address: this.getAddress(),
        abi: STUDIO_CHAIN_TOKEN_ABI,
        functionName: "totalSupply",
        args: []
      });
      return formatUnits(supply, 18);
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
}
class TokenAMMContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).tokenAMM;
  }
  async getSTCPrice() {
    const price = await readContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "getSTCPrice",
      args: []
    });
    return formatUnits(price, 6);
  }
  async getPoolInfo() {
    const poolInfo = await readContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "getPoolInfo",
      args: []
    });
    const [stcBalance, usdcBalance, totalLiq, currentPrice, revenue] = poolInfo;
    return {
      stcBalance: formatUnits(stcBalance, 18),
      usdcBalance: formatUnits(usdcBalance, 6),
      totalLiquidity: Number(totalLiq),
      currentPrice: formatUnits(currentPrice, 6),
      monthlyRevenue: formatUnits(revenue, 6)
    };
  }
  async swapSTCForUSDC(stcAmount, minUsdcOut) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "swapSTCForUSDC",
      args: [parseUnits(stcAmount, 18), parseUnits(minUsdcOut, 6)]
    });
  }
  async swapUSDCForSTC(usdcAmount, minStcOut) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "swapUSDCForSTC",
      args: [parseUnits(usdcAmount, 6), parseUnits(minStcOut, 18)]
    });
  }
  async addLiquidity(stcAmount, usdcAmount, minLiquidity = 0) {
    return await writeContract(config, {
      address: this.getAddress(),
      abi: TOKEN_AMM_ABI,
      functionName: "addLiquidity",
      args: [parseUnits(stcAmount, 18), parseUnits(usdcAmount, 6), BigInt(minLiquidity)]
    });
  }
}
class USDCContract {
  getAddress() {
    const chainId = getChainId(config);
    return getContractAddresses(chainId).usdcToken;
  }
  async balanceOf(address) {
    const balance = await readContract(config, {
      address: this.getAddress(),
      abi: USDC_ABI,
      functionName: "balanceOf",
      args: [address]
    });
    return formatUnits(balance, 6);
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
    const allowance = await readContract(config, {
      address: this.getAddress(),
      abi: USDC_ABI,
      functionName: "allowance",
      args: [owner, spender]
    });
    return formatUnits(allowance, 6);
  }
}
const stcToken = new STCTokenContract();
const tokenAMM = new TokenAMMContract();
const usdcToken = new USDCContract();
async function getUserBalances(address) {
  try {
    const [stcBalance, usdcBalance] = await Promise.all([
      stcToken.balanceOf(address),
      usdcToken.balanceOf(address)
    ]);
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

export { getUserBalances as g, stcToken as s, tokenAMM as t };
//# sourceMappingURL=contracts-1y8JjJRR.js.map
