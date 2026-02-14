// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "./TokenAMM.sol"; // Import refactored AMM

/**
 * @title Studio Token (STC)
 * @dev Utility token for the Sephar Studios streaming platform
 * Works with TokenAMM for liquidity, swaps, and buybacks.
 */
contract StudioToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard, Pausable {
    // Token distribution constants - Hybrid Model: 2B supply + revenue replenishment
    uint256 public constant TOTAL_SUPPLY = 2_000_000_000 * 10**18; // 2 billion STC
    uint256 public constant USER_REWARDS_ALLOCATION = 1_000_000_000 * 10**18; // 50% - 1 billion STC
    uint256 public constant CREATOR_INCENTIVES_ALLOCATION = 500_000_000 * 10**18; // 25% - 500M STC
    uint256 public constant PLATFORM_DEVELOPMENT_ALLOCATION = 300_000_000 * 10**18; // 15% - 300M STC
    uint256 public constant COMMUNITY_GOVERNANCE_ALLOCATION = 200_000_000 * 10**18; // 10% - 200M STC

    // Vesting and distribution tracking
    mapping(address => uint256) public userRewardsEarned;
    mapping(address => uint256) public creatorIncentivesEarned;
    mapping(address => uint256) public lastRewardClaim;

    // Platform addresses
    address public platformTreasury;
    address public creatorRewardsPool;
    address public userRewardsPool;
    address public governancePool;

    // AMM + USDC integration
    TokenAMM public tokenAMM;
    address public usdcToken;

    // Reward rates and limits
    uint256 public dailyUserRewardLimit = 50 * 10**18; // 50 STC/day
    uint256 public viewingRewardRate = 5 * 10**18; // 5 STC/hour
    uint256 public referralReward = 100 * 10**18; // 100 STC/referral

    // Staking for subscription discounts
    mapping(address => StakingInfo) public stakingInfo;
    uint256 public totalStaked;

    struct StakingInfo {
        uint256 amount;
        uint256 stakingTime;
        uint256 lockPeriod; // in seconds
        uint256 discountTier; // 0-4 representing discount tiers
    }

    // Events
    event RewardClaimed(address indexed user, uint256 amount, string rewardType);
    event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod);
    event TokensUnstaked(address indexed user, uint256 amount);
    event CreatorIncentivePaid(address indexed creator, uint256 amount);
    event SubscriptionDiscount(address indexed user, uint256 discountPercentage);
    event BuybackExecuted(uint256 usdcAmount);

    constructor(
        address _platformTreasury,
        address _creatorRewardsPool,
        address _userRewardsPool,
        address _governancePool,
        address _usdcToken
    ) ERC20("Studio Token", "STC") {
        platformTreasury = _platformTreasury;
        creatorRewardsPool = _creatorRewardsPool;
        userRewardsPool = _userRewardsPool;
        governancePool = _governancePool;
        usdcToken = _usdcToken;

        // Initial token distribution
        _mint(platformTreasury, PLATFORM_DEVELOPMENT_ALLOCATION);
        _mint(creatorRewardsPool, CREATOR_INCENTIVES_ALLOCATION);
        _mint(userRewardsPool, USER_REWARDS_ALLOCATION);
        _mint(governancePool, COMMUNITY_GOVERNANCE_ALLOCATION);
    }

    /**
     * @dev Link TokenAMM contract (can be updated if redeployed).
     */
    function setTokenAMM(address _tokenAMM) external onlyOwner {
        require(_tokenAMM != address(0), "Invalid AMM address");
        tokenAMM = TokenAMM(_tokenAMM);
    }

    /**
     * @dev Reward users for platform engagement.
     */
    function rewardUser(address user, uint256 amount, string memory rewardType)
        external
        onlyOwner
        whenNotPaused
    {
        require(user != address(0), "Invalid user");
        require(amount > 0, "Reward must be positive");

        if (block.timestamp < lastRewardClaim[user] + 1 days) {
            require(
                userRewardsEarned[user] + amount <= dailyUserRewardLimit,
                "Daily limit exceeded"
            );
        } else {
            userRewardsEarned[user] = 0;
            lastRewardClaim[user] = block.timestamp;
        }

        userRewardsEarned[user] += amount;
        _transfer(userRewardsPool, user, amount);

        emit RewardClaimed(user, amount, rewardType);
    }

    /**
     * @dev Pay creator incentives.
     */
    function payCreatorIncentive(address creator, uint256 amount)
        external
        onlyOwner
        whenNotPaused
    {
        require(creator != address(0), "Invalid creator");
        require(amount > 0, "Incentive must be positive");

        creatorIncentivesEarned[creator] += amount;
        _transfer(creatorRewardsPool, creator, amount);

        emit CreatorIncentivePaid(creator, amount);
    }

    /**
     * @dev Stake STC tokens for subscription discounts.
     */
    function stakeForDiscount(uint256 amount, uint256 lockPeriod)
        external
        nonReentrant
        whenNotPaused
    {
        require(amount > 0, "Invalid stake");
        require(
            lockPeriod == 90 days || lockPeriod == 180 days ||
            lockPeriod == 365 days || lockPeriod == 730 days,
            "Invalid lock"
        );
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        uint256 discountTier = calculateDiscountTier(amount, lockPeriod);

        stakingInfo[msg.sender].amount += amount;
        stakingInfo[msg.sender].stakingTime = block.timestamp;
        stakingInfo[msg.sender].lockPeriod = lockPeriod;
        stakingInfo[msg.sender].discountTier = discountTier;

        totalStaked += amount;
        _transfer(msg.sender, address(this), amount);

        emit TokensStaked(msg.sender, amount, lockPeriod);
        emit SubscriptionDiscount(msg.sender, getDiscountPercentage(discountTier));
    }

    function unstake() external nonReentrant {
        StakingInfo storage info = stakingInfo[msg.sender];
        require(info.amount > 0, "Nothing staked");
        require(block.timestamp >= info.stakingTime + info.lockPeriod, "Locked");

        uint256 amountToUnstake = info.amount;
        info.amount = 0;
        info.stakingTime = 0;
        info.lockPeriod = 0;
        info.discountTier = 0;

        totalStaked -= amountToUnstake;
        _transfer(address(this), msg.sender, amountToUnstake);

        emit TokensUnstaked(msg.sender, amountToUnstake);
    }

    function calculateDiscountTier(uint256 amount, uint256 lockPeriod)
        internal
        pure
        returns (uint256)
    {
        if (amount >= 150_000 * 10**18) return lockPeriod >= 730 days ? 4 : 4;
        if (amount >= 50_000 * 10**18) return lockPeriod >= 730 days ? 4 : 3;
        if (amount >= 15_000 * 10**18) return lockPeriod >= 730 days ? 3 : 2;
        if (amount >= 5_000 * 10**18) return lockPeriod >= 730 days ? 2 : 1;
        return 0;
    }

    function getDiscountPercentage(uint256 tier) internal pure returns (uint256) {
        if (tier == 1) return 10;
        if (tier == 2) return 20;
        if (tier == 3) return 35;
        if (tier == 4) return 50;
        return 0;
    }

    function getUserDiscount(address user) external view returns (uint256) {
        StakingInfo memory info = stakingInfo[user];
        if (info.amount == 0) return 0;
        if (block.timestamp < info.stakingTime + info.lockPeriod) {
            return getDiscountPercentage(info.discountTier);
        }
        return 0;
    }

    /**
     * @dev Execute buyback using AMM.
     * - Approves USDC to AMM.
     * - Calls AMM buyback.
     */
    function buybackTokens(uint256 usdcAmount) external onlyOwner {
        require(address(tokenAMM) != address(0), "AMM not set");
        require(usdcAmount > 0, "Invalid amount");

        IERC20(usdcToken).approve(address(tokenAMM), usdcAmount);
        tokenAMM.executeBuyback(usdcAmount);

        emit BuybackExecuted(usdcAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updateRewardRates(
        uint256 _dailyLimit,
        uint256 _viewingRate,
        uint256 _referralReward
    ) external onlyOwner {
        dailyUserRewardLimit = _dailyLimit;
        viewingRewardRate = _viewingRate;
        referralReward = _referralReward;
    }

    function getStakingInfo(address user)
        external
        view
        returns (
            uint256 amount,
            uint256 stakingTime,
            uint256 lockPeriod,
            uint256 discountTier,
            bool isUnlocked
        )
    {
        StakingInfo memory info = stakingInfo[user];
        return (
            info.amount,
            info.stakingTime,
            info.lockPeriod,
            info.discountTier,
            block.timestamp >= info.stakingTime + info.lockPeriod
        );
    }

    // Revenue replenishment tracking
    uint256 public totalBuybacks;
    uint256 public totalReplenished;
    uint256 public monthlyRevenue;
    uint256 public lastReplenishmentTime;

    event RevenueReplenishment(uint256 usdcAmount, uint256 stcReceived, uint256 timestamp);
    event PoolReplenished(uint256 stcAmount, string poolType);

    /**
     * @dev Revenue-driven STC buyback with automatic pool replenishment
     * This is the core of the hybrid sustainability model
     */
    function replenishRewardsPool(uint256 usdcAmount) external onlyOwner nonReentrant {
        require(address(tokenAMM) != address(0), "AMM not set");
        require(usdcAmount > 0, "Invalid amount");

        // Execute buyback through AMM
        IERC20(usdcToken).transferFrom(msg.sender, address(this), usdcAmount);
        IERC20(usdcToken).approve(address(tokenAMM), usdcAmount);

        uint256 stcBefore = balanceOf(address(this));
        tokenAMM.swapUSDCForSTC(usdcAmount, 0); // 0 = no slippage protection for simplicity
        uint256 stcReceived = balanceOf(address(this)) - stcBefore;

        // Add purchased STC to user rewards pool
        _transfer(address(this), userRewardsPool, stcReceived);

        // Update tracking
        totalBuybacks += usdcAmount;
        totalReplenished += stcReceived;
        lastReplenishmentTime = block.timestamp;

        emit RevenueReplenishment(usdcAmount, stcReceived, block.timestamp);
        emit PoolReplenished(stcReceived, "user_rewards");
    }

    /**
     * @dev Internal function to execute replenishment without external checks
     */
    function _executeReplenishment(uint256 usdcAmount) internal {
        require(address(tokenAMM) != address(0), "AMM not set");
        require(usdcAmount > 0, "Invalid amount");

        // Execute buyback through AMM
        IERC20(usdcToken).approve(address(tokenAMM), usdcAmount);

        uint256 stcBefore = balanceOf(address(this));
        tokenAMM.swapUSDCForSTC(usdcAmount, 0); // 0 = no slippage protection for simplicity
        uint256 stcReceived = balanceOf(address(this)) - stcBefore;

        // Add purchased STC to user rewards pool
        _transfer(address(this), userRewardsPool, stcReceived);

        // Update tracking
        totalBuybacks += usdcAmount;
        totalReplenished += stcReceived;
        lastReplenishmentTime = block.timestamp;

        emit RevenueReplenishment(usdcAmount, stcReceived, block.timestamp);
        emit PoolReplenished(stcReceived, "user_rewards");
    }

    /**
     * @dev Auto-replenishment based on revenue percentage
     * Called by platform when processing subscription payments
     */
    function autoReplenishFromRevenue(uint256 subscriptionRevenue, uint256 replenishPercentage)
        external
        onlyOwner
        nonReentrant
    {
        require(replenishPercentage <= 100, "Invalid percentage");

        uint256 replenishAmount = (subscriptionRevenue * replenishPercentage) / 100;
        monthlyRevenue += subscriptionRevenue;

        if (replenishAmount > 0) {
            _executeReplenishment(replenishAmount);
        }
    }

    /**
     * @dev Get pool sustainability metrics
     */
    function getPoolSustainabilityMetrics()
        external
        view
        returns (
            uint256 userRewardsRemaining,
            uint256 dailyBurnRate,
            uint256 daysRemaining,
            uint256 monthlyReplenishmentRate,
            bool isSustainable
        )
    {
        userRewardsRemaining = balanceOf(userRewardsPool);

        // Estimate daily burn (simplified calculation)
        dailyBurnRate = dailyUserRewardLimit * 1000; // Assume 1000 active users

        daysRemaining = userRewardsRemaining > 0 ? userRewardsRemaining / dailyBurnRate : 0;

        // Monthly replenishment rate (last 30 days average)
        monthlyReplenishmentRate = totalReplenished; // Simplified

        isSustainable = monthlyReplenishmentRate * 30 >= dailyBurnRate * 30;
    }

    /**
     * @dev Emergency pool rebalancing - redistribute from other pools if needed
     */
    function emergencyPoolRebalance(uint256 amount, string memory fromPool)
        external
        onlyOwner
    {
        require(amount > 0, "Invalid amount");

        address sourcePool;
        if (keccak256(bytes(fromPool)) == keccak256(bytes("platform"))) {
            sourcePool = platformTreasury;
        } else if (keccak256(bytes(fromPool)) == keccak256(bytes("governance"))) {
            sourcePool = governancePool;
        } else {
            revert("Invalid source pool");
        }

        require(balanceOf(sourcePool) >= amount, "Insufficient balance in source pool");

        _transfer(sourcePool, userRewardsPool, amount);
        emit PoolReplenished(amount, "emergency_rebalance");
    }

    /**
     * @dev Deflationary mechanism - burn excess tokens
     */
    function burnExcessSupply(uint256 amount) external onlyOwner {
        require(amount > 0, "Invalid amount");
        require(balanceOf(platformTreasury) >= amount, "Insufficient treasury balance");

        _transfer(platformTreasury, address(0xdead), amount); // Burn to dead address
        emit Transfer(platformTreasury, address(0xdead), amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
