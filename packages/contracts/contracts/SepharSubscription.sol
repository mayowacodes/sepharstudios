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

    // Events
    event SubscriptionMinted(address indexed subscriber, uint256 indexed tokenId, SubscriptionTier tier, uint256 expiryDate);
    event SubscriptionRenewed(address indexed subscriber, uint256 indexed tokenId, uint256 newExpiryDate);
    event RevenueDistributed(uint256 indexed tokenId, uint256 creatorShare, uint256 platformShare, uint256 buybackAmount, uint256 userRewards);

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

        subscriptionPricing[SubscriptionTier.Basic] = 1000;   // $10
        subscriptionPricing[SubscriptionTier.Premium] = 1500; // $15
        subscriptionPricing[SubscriptionTier.Creator] = 2500; // $25
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
