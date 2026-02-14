// Contract ABIs - These will be auto-generated after contract compilation
// For now, we'll include the key functions needed

export const STUDIO_CHAIN_TOKEN_ABI = [
  // Basic ERC20 functions
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',

  // Staking functions
  'function stakeForDiscount(uint256 amount, uint256 lockPeriod)',
  'function unstake()',
  'function getUserDiscount(address user) view returns (uint256)',
  'function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)',

  // Reward functions
  'function rewardUser(address user, uint256 amount, string memory rewardType)',
  'function userRewardsEarned(address user) view returns (uint256)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod)',
  'event TokensUnstaked(address indexed user, uint256 amount)',
  'event RewardClaimed(address indexed user, uint256 amount, string rewardType)'
] as const

export const STUDIO_CHAIN_SUBSCRIPTION_ABI = [
  // NFT functions
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',

  // Subscription functions
  'function mintSubscription(address subscriber, uint8 tier, uint256 amountPaid, uint256 duration) returns (uint256)',
  'function renewSubscription(address subscriber, uint256 additionalDuration) returns (uint256)',
  'function getSubscriptionStatus(address subscriber) view returns (bool isActive, uint256 tokenId, uint256 expiryDate)',
  'function getSubscriptionDetails(uint256 tokenId) view returns (address subscriber, uint8 tier, uint256 amountPaid, uint256 startDate, uint256 expiryDate, bool isActive, uint256 renewalCount, uint256 totalRevenue)',
  'function hasActiveSubscription(address user) view returns (bool hasAccess, uint8 tier)',

  // Events
  'event SubscriptionMinted(address indexed subscriber, uint256 indexed tokenId, uint8 tier, uint256 expiryDate)',
  'event SubscriptionRenewed(address indexed subscriber, uint256 indexed tokenId, uint256 newExpiryDate)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
] as const

export const CREATOR_PAYMENTS_ABI = [
  // Creator management
  'function registerCreator(address creator, uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct)',
  'function updateCreatorPaymentMethod(address creator, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct)',
  'function getCreatorProfile(address creator) view returns (uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct, uint256 totalEarnings, uint256 pendingAmount, bool isActive)',

  // Revenue tracking
  'function recordContentRevenue(uint256 contentId, address creator, uint256 totalRevenue)',
  'function getContentRevenue(uint256 contentId) view returns (address creator, uint256 totalRevenue, uint256 creatorShare, uint256 paidAmount, bool isFullyPaid)',
  'function getCreatorContentIds(address creator) view returns (uint256[])',

  // Payment processing
  'function processCreatorPayment(address creator)',
  'function batchProcessPayments(address[] calldata creators)',
  'function pendingPayments(address creator) view returns (uint256)',
  'function totalLifetimeEarnings(address creator) view returns (uint256)',

  // Events
  'event CreatorRegistered(address indexed creator, uint8 tier, uint8 method)',
  'event RevenueRecorded(uint256 indexed contentId, address indexed creator, uint256 amount)',
  'event PaymentProcessed(address indexed creator, uint256 amount, string paymentType)',
  'event FiatPaymentQueued(address indexed creator, uint256 amount)'
] as const

export const TOKEN_AMM_ABI = [
  // Liquidity functions
  'function addLiquidity(uint256 stcAmount, uint256 usdcAmount, uint256 minLiquidity) returns (uint256)',
  'function removeLiquidity(uint256 liquidityTokens, uint256 minStc, uint256 minUsdc) returns (uint256 stcAmount, uint256 usdcAmount)',

  // Trading functions
  'function swapSTCForUSDC(uint256 stcAmountIn, uint256 minUsdcOut) returns (uint256)',
  'function swapUSDCForSTC(uint256 usdcAmountIn, uint256 minStcOut) returns (uint256)',
  'function getSTCPrice() view returns (uint256)',

  // Pool information
  'function getPoolInfo() view returns (uint256 stcBalance, uint256 usdcBalance, uint256 totalLiq, uint256 currentPrice, uint256 revenue)',
  'function stcReserve() view returns (uint256)',
  'function usdcReserve() view returns (uint256)',
  'function totalLiquidity() view returns (uint256)',
  'function liquidityProviders(address provider) view returns (uint256)',

  // Platform functions
  'function executeBuyback(uint256 usdcAmount)',
  'function updatePlatformRevenue(uint256 newRevenue)',
  'function monthlyPlatformRevenue() view returns (uint256)',

  // Events
  'event LiquidityAdded(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)',
  'event LiquidityRemoved(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 liquidityTokens)',
  'event TokenSwapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)',
  'event BuybackExecuted(uint256 usdcAmount, uint256 stcAmount)',
  'event RevenueUpdated(uint256 newRevenue, uint256 timestamp)'
] as const

export const USDC_ABI = [
  // Standard ERC20 functions
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
] as const

// Contract names for easier reference
export const CONTRACT_NAMES = {
  STUDIO_CHAIN_TOKEN: 'StudioChainToken',
  STUDIO_CHAIN_SUBSCRIPTION: 'StudioChainSubscription',
  CREATOR_PAYMENTS: 'CreatorPayments',
  TOKEN_AMM: 'TokenAMM',
  USDC_TOKEN: 'USDC'
} as const

// Type definitions for contract interactions
export type ContractName = keyof typeof CONTRACT_NAMES

export interface ContractConfig {
  name: ContractName
  abi: readonly string[]
  address: string
}

/**
 * Get contract configuration for a specific contract
 */
export function getContractConfig(
  contractName: ContractName,
  address: string
): ContractConfig {
  const abiMap = {
    STUDIO_CHAIN_TOKEN: STUDIO_CHAIN_TOKEN_ABI,
    STUDIO_CHAIN_SUBSCRIPTION: STUDIO_CHAIN_SUBSCRIPTION_ABI,
    CREATOR_PAYMENTS: CREATOR_PAYMENTS_ABI,
    TOKEN_AMM: TOKEN_AMM_ABI,
    USDC_TOKEN: USDC_ABI
  }

  return {
    name: contractName,
    abi: abiMap[contractName],
    address
  }
}