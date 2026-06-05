//#region src/lib/web3/abis.ts
var STUDIO_CHAIN_TOKEN_ABI = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function balanceOf(address owner) view returns (uint256)",
	"function totalSupply() view returns (uint256)",
	"function transfer(address to, uint256 amount) returns (bool)",
	"function transferFrom(address from, address to, uint256 amount) returns (bool)",
	"function approve(address spender, uint256 amount) returns (bool)",
	"function allowance(address owner, address spender) view returns (uint256)",
	"function stakeForDiscount(uint256 amount, uint256 lockPeriod)",
	"function addToStake(uint256 additionalAmount)",
	"function unstake()",
	"function getUserDiscount(address user) view returns (uint256)",
	"function getStakingInfo(address user) view returns (uint256 amount, uint256 stakingTime, uint256 lockPeriod, uint256 discountTier, bool isUnlocked)",
	"function rewardUser(address user, uint256 amount, string memory rewardType)",
	"function batchRewardUsers(address[] users, uint256[] amounts, string memory rewardType)",
	"function userRewardsEarned(address user) view returns (uint256)",
	"event Transfer(address indexed from, address indexed to, uint256 value)",
	"event Approval(address indexed owner, address indexed spender, uint256 value)",
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
export { USDC_ABI as a, TOKEN_AMM_ABI as i, STUDIO_CHAIN_SUBSCRIPTION_ABI as n, STUDIO_CHAIN_TOKEN_ABI as r, CREATOR_PAYMENTS_ABI as t };
