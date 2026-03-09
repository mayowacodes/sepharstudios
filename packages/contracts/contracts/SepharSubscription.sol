// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./StudioToken.sol";
import "./TokenAMM.sol";

/**
 * @title Sephar Studios Subscription NFTs
 * @dev NFTs representing active subscriptions with automatic revenue distribution
 */
contract SepharSubscription is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    uint256 private _tokenIdCounter;
    StudioToken public stcToken;
    IERC20 public usdcToken;
    TokenAMM public tokenAMM;

    // Subscription tiers and pricing
    enum SubscriptionTier { Basic, Premium, Creator }

    struct Subscription {
        address subscriber;
        SubscriptionTier tier;
        uint256 amountPaid; // in USD cents
        uint256 startDate;
        uint256 expiryDate;
        bool isActive;
        uint256 renewalCount;
        uint256 totalRevenue; // Total revenue generated
    }

    // Mappings
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256) public userSubscriptionTokenId;
    mapping(address => uint256) public totalUserRevenue;

    // Platform addresses
    address public platformTreasury;
    address public creatorRevenuePool;
    address public userRewardPool;

    // Revenue distribution percentages (basis points, 100 = 1%)
    uint256 public constant CREATOR_REVENUE_SHARE = 3000; // 30%
    uint256 public constant PLATFORM_OPERATIONS = 5500;   // 55%
    uint256 public constant STC_BUYBACK = 800;            // 8%
    uint256 public constant USER_REWARDS = 400;           // 4%
    uint256 public constant PLATFORM_RESERVE = 300;       // 3%

    // Subscription pricing
    mapping(SubscriptionTier => uint256) public subscriptionPricing;

    // STC subscription: 500 STC = 1 month Basic (Phase 1 launch pricing)
    // Owner adjusts via updateSTCSubscriptionAmount() as STC price appreciates:
    //   Phase 1 (STC < $0.02):  500 STC ≈ $5 — fair launch discount
    //   Phase 2 ($0.02–$0.05):  300 STC ≈ $6–$15
    //   Phase 3 (STC > $0.05):  200 STC ≈ $10+ (full price parity)
    // Cooldown alternates: 100 days after odd redemptions, 200 days after even
    uint256 public stcSubscriptionAmount = 500 * 10**18;
    uint256 public constant STC_COOLDOWN_SHORT = 100 days; // after 1st, 3rd, 5th... redemption
    uint256 public constant STC_COOLDOWN_LONG  = 200 days; // after 2nd, 4th, 6th... redemption

    struct STCSubInfo {
        uint256 redemptionCount;    // how many times redeemed with STC
        uint256 lastRedemptionTime; // timestamp of last STC redemption
    }
    mapping(address => STCSubInfo) public stcSubUsage;

    // Events
    event SubscriptionMinted(address indexed subscriber, uint256 indexed tokenId, SubscriptionTier tier, uint256 expiryDate);
    event SubscriptionRenewed(address indexed subscriber, uint256 indexed tokenId, uint256 newExpiryDate);
    event RevenueDistributed(uint256 indexed tokenId, uint256 creatorShare, uint256 platformShare, uint256 buybackAmount, uint256 userRewards);
    event SubscriptionMintedWithSTC(address indexed subscriber, uint256 indexed tokenId, uint256 stcAmount, uint256 nextCooldownDays);

    constructor(
        address _stcToken,
        address _usdcToken,
        address _platformTreasury,
        address _creatorRevenuePool,
        address _userRewardPool,
        address _tokenAMM
    ) ERC721("Sephar Studios Subscription", "SSS") {
        stcToken = StudioToken(_stcToken);
        usdcToken = IERC20(_usdcToken);
        platformTreasury = _platformTreasury;
        creatorRevenuePool = _creatorRevenuePool;
        userRewardPool = _userRewardPool;
        tokenAMM = TokenAMM(_tokenAMM);

        subscriptionPricing[SubscriptionTier.Basic] = 300;    // $3/month
        subscriptionPricing[SubscriptionTier.Premium] = 1000; // $10/month
        subscriptionPricing[SubscriptionTier.Creator] = 1500; // $15/month
    }

    function mintSubscription(
        address subscriber,
        SubscriptionTier tier,
        uint256 amountPaid,
        uint256 duration
    ) external onlyOwner nonReentrant whenNotPaused returns (uint256) {
        require(subscriber != address(0), "Invalid subscriber");
        require(amountPaid >= subscriptionPricing[tier], "Insufficient payment");
        require(duration > 0, "Invalid duration");

        uint256 existingTokenId = userSubscriptionTokenId[subscriber];
        if (existingTokenId != 0 && subscriptions[existingTokenId].isActive) {
            return renewSubscription(subscriber, duration);
        }

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        subscriptions[tokenId] = Subscription({
            subscriber: subscriber,
            tier: tier,
            amountPaid: amountPaid,
            startDate: block.timestamp,
            expiryDate: block.timestamp + duration,
            isActive: true,
            renewalCount: 0,
            totalRevenue: amountPaid
        });

        userSubscriptionTokenId[subscriber] = tokenId;

        _safeMint(subscriber, tokenId);
        _setTokenURI(tokenId, generateTokenURI(tokenId, tier));

        distributeRevenue(tokenId, amountPaid);

        emit SubscriptionMinted(subscriber, tokenId, tier, block.timestamp + duration);
        return tokenId;
    }

    function renewSubscription(address subscriber, uint256 additionalDuration)
        public onlyOwner nonReentrant whenNotPaused returns (uint256)
    {
        uint256 tokenId = userSubscriptionTokenId[subscriber];
        require(tokenId != 0, "No subscription");

        Subscription storage sub = subscriptions[tokenId];
        require(sub.subscriber == subscriber, "Invalid subscriber");

        sub.expiryDate = block.timestamp + additionalDuration;
        sub.isActive = true;
        sub.renewalCount += 1;

        uint256 renewalAmount = subscriptionPricing[sub.tier];
        sub.totalRevenue += renewalAmount;

        distributeRevenue(tokenId, renewalAmount);

        emit SubscriptionRenewed(subscriber, tokenId, sub.expiryDate);
        return tokenId;
    }

    function distributeRevenue(uint256 tokenId, uint256 amount) internal {
        uint256 creatorShare = (amount * CREATOR_REVENUE_SHARE) / 10000;
        uint256 platformShare = (amount * PLATFORM_OPERATIONS) / 10000;
        uint256 buybackAmount = (amount * STC_BUYBACK) / 10000;
        uint256 userRewardsAmount = (amount * USER_REWARDS) / 10000;

        totalUserRevenue[subscriptions[tokenId].subscriber] += amount;

        emit RevenueDistributed(tokenId, creatorShare, platformShare, buybackAmount, userRewardsAmount);

        if (buybackAmount > 0) {
            uint256 usdcAmount = buybackAmount * 10**4; // cents → USDC
            require(usdcToken.transfer(address(tokenAMM), usdcAmount), "USDC transfer failed");
            tokenAMM.updatePlatformRevenue(usdcAmount);
        }
    }

    function getSubscriptionStatus(address subscriber)
        external view returns (bool isActive, uint256 tokenId, uint256 expiryDate)
    {
        tokenId = userSubscriptionTokenId[subscriber];
        if (tokenId == 0) return (false, 0, 0);
        Subscription memory sub = subscriptions[tokenId];
        return (sub.isActive && block.timestamp <= sub.expiryDate, tokenId, sub.expiryDate);
    }

    function getSubscriptionDetails(uint256 tokenId)
        external view returns (
            address subscriber, SubscriptionTier tier, uint256 amountPaid,
            uint256 startDate, uint256 expiryDate, bool isActive,
            uint256 renewalCount, uint256 totalRevenue
        )
    {
        require(_exists(tokenId), "Not found");
        Subscription memory sub = subscriptions[tokenId];
        return (
            sub.subscriber, sub.tier, sub.amountPaid, sub.startDate,
            sub.expiryDate, sub.isActive && block.timestamp <= sub.expiryDate,
            sub.renewalCount, sub.totalRevenue
        );
    }

    function generateTokenURI(uint256 tokenId, SubscriptionTier tier)
        internal view returns (string memory)
    {
        string memory tierName = getTierName(tier);
        uint256 price = subscriptionPricing[tier];
        return string(abi.encodePacked(
            "https://api.studiochain.com/subscription/metadata/",
            Strings.toString(tokenId),
            "?tier=", tierName,
            "&price=", Strings.toString(price)
        ));
    }

    function getTierName(SubscriptionTier tier) internal pure returns (string memory) {
        if (tier == SubscriptionTier.Basic) return "Basic";
        if (tier == SubscriptionTier.Premium) return "Premium";
        if (tier == SubscriptionTier.Creator) return "Creator";
        return "Unknown";
    }

    /**
     * @dev Pay for one month Basic subscription using 200 STC.
     *      Spent STC returns to platformTreasury (not burned) for recycling.
     *      Cooldown alternates: 100 days after odd redemptions, 200 days after even.
     *      Frontend must call stcToken.approve(subscriptionContract, 200e18) first.
     */
    function mintSubscriptionWithSTC() external nonReentrant whenNotPaused returns (uint256) {
        STCSubInfo storage info = stcSubUsage[msg.sender];

        // Enforce alternating cooldown
        if (info.redemptionCount > 0) {
            uint256 cooldown = (info.redemptionCount % 2 == 1)
                ? STC_COOLDOWN_SHORT  // 100 days after 1st, 3rd, 5th...
                : STC_COOLDOWN_LONG;  // 200 days after 2nd, 4th, 6th...
            require(block.timestamp >= info.lastRedemptionTime + cooldown, "STC cooldown active");
        }

        // Transfer 200 STC from user back to platform treasury
        require(stcToken.balanceOf(msg.sender) >= stcSubscriptionAmount, "Insufficient STC balance");
        require(
            stcToken.transferFrom(msg.sender, platformTreasury, stcSubscriptionAmount),
            "STC transfer failed"
        );

        // Update redemption tracking
        info.redemptionCount += 1;
        info.lastRedemptionTime = block.timestamp;

        // Next cooldown: odd count → 100 days, even count → 200 days
        uint256 nextCooldownDays = (info.redemptionCount % 2 == 1) ? 100 : 200;

        // Mint or extend subscription for 30 days at Basic tier
        uint256 duration = 30 days;
        uint256 tokenId;
        uint256 existingTokenId = userSubscriptionTokenId[msg.sender];

        if (existingTokenId != 0 &&
            subscriptions[existingTokenId].isActive &&
            block.timestamp <= subscriptions[existingTokenId].expiryDate) {
            // Extend active subscription
            subscriptions[existingTokenId].expiryDate += duration;
            subscriptions[existingTokenId].renewalCount += 1;
            tokenId = existingTokenId;
            emit SubscriptionRenewed(msg.sender, tokenId, subscriptions[existingTokenId].expiryDate);
        } else {
            // Mint new subscription NFT
            _tokenIdCounter++;
            tokenId = _tokenIdCounter;

            subscriptions[tokenId] = Subscription({
                subscriber: msg.sender,
                tier: SubscriptionTier.Basic,
                amountPaid: 0, // paid in STC, not USDC
                startDate: block.timestamp,
                expiryDate: block.timestamp + duration,
                isActive: true,
                renewalCount: 0,
                totalRevenue: 0
            });

            userSubscriptionTokenId[msg.sender] = tokenId;
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, generateTokenURI(tokenId, SubscriptionTier.Basic));

            emit SubscriptionMinted(msg.sender, tokenId, SubscriptionTier.Basic, block.timestamp + duration);
        }

        emit SubscriptionMintedWithSTC(msg.sender, tokenId, stcSubscriptionAmount, nextCooldownDays);
        return tokenId;
    }

    /**
     * @dev Check how long a user must wait before their next STC subscription redemption.
     *      Returns (0, nextCooldownDays) if ready to redeem now.
     */
    function getSTCCooldownStatus(address user)
        external view returns (uint256 secondsRemaining, uint256 nextCooldownDays)
    {
        STCSubInfo memory info = stcSubUsage[user];
        if (info.redemptionCount == 0) return (0, 0);

        uint256 cooldown = (info.redemptionCount % 2 == 1) ? STC_COOLDOWN_SHORT : STC_COOLDOWN_LONG;
        uint256 unlockAt = info.lastRedemptionTime + cooldown;

        secondsRemaining = block.timestamp >= unlockAt ? 0 : unlockAt - block.timestamp;
        nextCooldownDays = (info.redemptionCount % 2 == 1) ? 100 : 200;
    }

    function updateSTCSubscriptionAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Invalid amount");
        stcSubscriptionAmount = newAmount;
    }

    function cancelSubscription(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Not found");
        subscriptions[tokenId].isActive = false;
    }

    function updateSubscriptionPricing(SubscriptionTier tier, uint256 price) external onlyOwner {
        require(price > 0, "Invalid price");
        subscriptionPricing[tier] = price;
    }

    function hasActiveSubscription(address user)
        external view returns (bool hasAccess, SubscriptionTier tier)
    {
        uint256 tokenId = userSubscriptionTokenId[user];
        if (tokenId == 0) return (false, SubscriptionTier.Basic);
        Subscription memory sub = subscriptions[tokenId];
        return (sub.isActive && block.timestamp <= sub.expiryDate, sub.tier);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override whenNotPaused
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        if (from != address(0) && to != address(0)) {
            if (userSubscriptionTokenId[from] == tokenId) userSubscriptionTokenId[from] = 0;
            userSubscriptionTokenId[to] = tokenId;
            subscriptions[tokenId].subscriber = to;
        }
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view
        override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
