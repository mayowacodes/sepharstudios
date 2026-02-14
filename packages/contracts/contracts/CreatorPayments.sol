// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./StudioToken.sol";
import "./TokenAMM.sol";

/**
 * @title Creator Payment Distribution System
 * @dev Handles automated revenue distribution to creators with AMM-based conversions
 */
contract CreatorPayments is Ownable, ReentrancyGuard, Pausable {
    StudioToken public stcToken;
    IERC20 public usdcToken;
    TokenAMM public tokenAMM;

    enum CreatorTier { Standard, Exclusive, TopPerformer }
    enum PaymentMethod { Fiat, USDC, STC, Mixed }

    struct CreatorProfile {
        address creatorAddress;
        CreatorTier tier;
        PaymentMethod paymentMethod;
        uint256 fiatPercentage;
        uint256 usdcPercentage;
        uint256 stcPercentage;
        bool isActive;
        uint256 totalEarnings;
        uint256 lastPayoutTime;
        string bankDetails;
    }

    struct ContentRevenue {
        uint256 contentId;
        address creator;
        uint256 totalRevenue;
        uint256 creatorShare;
        uint256 paidAmount;
        bool isFullyPaid;
        uint256 timestamp;
    }

    mapping(CreatorTier => uint256) public tierRevenueShares;
    mapping(address => CreatorProfile) public creatorProfiles;
    mapping(uint256 => ContentRevenue) public contentRevenues;
    mapping(address => uint256[]) public creatorContentIds;
    mapping(address => uint256) public pendingPayments;
    mapping(address => uint256) public totalLifetimeEarnings;

    uint256 public minimumPayoutAmount = 1000; // $10
    address public platformTreasury;
    address public usdcTreasury;

    event CreatorRegistered(address indexed creator, CreatorTier tier, PaymentMethod method);
    event CreatorTierUpdated(address indexed creator, CreatorTier oldTier, CreatorTier newTier);
    event PaymentMethodUpdated(address indexed creator, PaymentMethod method);
    event RevenueRecorded(uint256 indexed contentId, address indexed creator, uint256 amount);
    event PaymentProcessed(address indexed creator, uint256 amount, string paymentType);
    event FiatPaymentQueued(address indexed creator, uint256 amount);

    constructor(
        address _stcToken,
        address _usdcToken,
        address _platformTreasury,
        address _usdcTreasury,
        address _tokenAMM
    ) {
        stcToken = StudioToken(_stcToken);
        usdcToken = IERC20(_usdcToken);
        platformTreasury = _platformTreasury;
        usdcTreasury = _usdcTreasury;
        tokenAMM = TokenAMM(_tokenAMM);

        tierRevenueShares[CreatorTier.Standard] = 3000;
        tierRevenueShares[CreatorTier.Exclusive] = 4000;
        tierRevenueShares[CreatorTier.TopPerformer] = 5500;
    }

    function registerCreator(
        address creator, CreatorTier tier, PaymentMethod paymentMethod,
        uint256 fiatPct, uint256 usdcPct, uint256 stcPct
    ) external onlyOwner {
        require(creator != address(0), "Invalid");
        require(fiatPct + usdcPct + stcPct == 100, "Bad split");

        creatorProfiles[creator] = CreatorProfile({
            creatorAddress: creator,
            tier: tier,
            paymentMethod: paymentMethod,
            fiatPercentage: fiatPct,
            usdcPercentage: usdcPct,
            stcPercentage: stcPct,
            isActive: true,
            totalEarnings: 0,
            lastPayoutTime: block.timestamp,
            bankDetails: ""
        });

        emit CreatorRegistered(creator, tier, paymentMethod);
    }

    function updateCreatorPaymentMethod(
        address creator, PaymentMethod paymentMethod,
        uint256 fiatPct, uint256 usdcPct, uint256 stcPct
    ) external {
        require(msg.sender == creator || msg.sender == owner(), "Unauthorized");
        require(creatorProfiles[creator].isActive, "Not active");
        require(fiatPct + usdcPct + stcPct == 100, "Bad split");

        CreatorProfile storage profile = creatorProfiles[creator];
        profile.paymentMethod = paymentMethod;
        profile.fiatPercentage = fiatPct;
        profile.usdcPercentage = usdcPct;
        profile.stcPercentage = stcPct;

        emit PaymentMethodUpdated(creator, paymentMethod);
    }

    function recordContentRevenue(uint256 contentId, address creator, uint256 totalRevenue)
        external onlyOwner nonReentrant whenNotPaused
    {
        require(creatorProfiles[creator].isActive, "Not registered");
        require(totalRevenue > 0, "Zero");

        CreatorTier tier = creatorProfiles[creator].tier;
        uint256 revenueShare = tierRevenueShares[tier];
        uint256 creatorShare = (totalRevenue * revenueShare) / 10000;

        contentRevenues[contentId] = ContentRevenue({
            contentId: contentId,
            creator: creator,
            totalRevenue: totalRevenue,
            creatorShare: creatorShare,
            paidAmount: 0,
            isFullyPaid: false,
            timestamp: block.timestamp
        });

        creatorContentIds[creator].push(contentId);
        pendingPayments[creator] += creatorShare;
        creatorProfiles[creator].totalEarnings += creatorShare;

        emit RevenueRecorded(contentId, creator, creatorShare);
    }

    function _convertUsdToStc(uint256 usdCents) internal view returns (uint256) {
        uint256 usdcAmount = usdCents * 10**4; // cents → USDC
        return tokenAMM.getStcAmountOut(usdcAmount);
    }

    function processCreatorPayment(address creator)
        external onlyOwner nonReentrant whenNotPaused
    {
        require(creatorProfiles[creator].isActive, "Not active");
        uint256 pendingAmount = pendingPayments[creator];
        require(pendingAmount >= minimumPayoutAmount, "Below threshold");

        CreatorProfile storage profile = creatorProfiles[creator];

        uint256 fiatAmount = (pendingAmount * profile.fiatPercentage) / 100;
        uint256 usdcAmount = (pendingAmount * profile.usdcPercentage) / 100;
        uint256 stcAmount = (pendingAmount * profile.stcPercentage) / 100;

        pendingPayments[creator] = 0;
        profile.lastPayoutTime = block.timestamp;
        totalLifetimeEarnings[creator] += pendingAmount;

        if (fiatAmount > 0) emit FiatPaymentQueued(creator, fiatAmount);

        if (usdcAmount > 0) {
            uint256 usdcTokenAmount = usdcAmount * 10**4;
            require(usdcToken.balanceOf(usdcTreasury) >= usdcTokenAmount, "Insufficient USDC");
            require(usdcToken.transferFrom(usdcTreasury, creator, usdcTokenAmount), "USDC transfer failed");
            emit PaymentProcessed(creator, usdcAmount, "USDC");
        }

        if (stcAmount > 0) {
            uint256 stcTokenAmount = _convertUsdToStc(stcAmount);
            stcToken.payCreatorIncentive(creator, stcTokenAmount);
            emit PaymentProcessed(creator, stcAmount, "STC");
        }
    }

    /**
     * @dev Update creator tier (affects revenue share)
     * @param creator Creator address
     * @param newTier New tier
     */
    function updateCreatorTier(address creator, CreatorTier newTier)
        external
        onlyOwner
    {
        require(creatorProfiles[creator].isActive, "Creator not registered");

        CreatorTier oldTier = creatorProfiles[creator].tier;
        creatorProfiles[creator].tier = newTier;

        emit CreatorTierUpdated(creator, oldTier, newTier);
    }

    struct CreatorProfileView {
        CreatorTier tier;
        PaymentMethod paymentMethod;
        uint256 fiatPct;
        uint256 usdcPct;
        uint256 stcPct;
        uint256 totalEarnings;
        uint256 pendingAmount;
        bool isActive;
    }

    /**
     * @dev Get creator profile information
     */
    function getCreatorProfile(address creator) external view returns (CreatorProfileView memory) {
        CreatorProfile memory profile = creatorProfiles[creator];
        return CreatorProfileView({
            tier: profile.tier,
            paymentMethod: profile.paymentMethod,
            fiatPct: profile.fiatPercentage,
            usdcPct: profile.usdcPercentage,
            stcPct: profile.stcPercentage,
            totalEarnings: profile.totalEarnings,
            pendingAmount: pendingPayments[creator],
            isActive: profile.isActive
        });
    }

    /**
     * @dev Get content revenue information
     */
    function getContentRevenue(uint256 contentId)
        external
        view
        returns (
            address creator,
            uint256 totalRevenue,
            uint256 creatorShare,
            uint256 paidAmount,
            bool isFullyPaid
        )
    {
        ContentRevenue memory revenue = contentRevenues[contentId];
        return (
            revenue.creator,
            revenue.totalRevenue,
            revenue.creatorShare,
            revenue.paidAmount,
            revenue.isFullyPaid
        );
    }

    /**
     * @dev Get creator's content IDs
     */
    function getCreatorContentIds(address creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorContentIds[creator];
    }

    /**
     * @dev Update tier revenue shares (governance function)
     */
    function updateTierRevenueShare(CreatorTier tier, uint256 sharePercentage)
        external
        onlyOwner
    {
        require(sharePercentage <= 10000, "Share cannot exceed 100%");
        tierRevenueShares[tier] = sharePercentage;
    }

    /**
     * @dev Update minimum payout amount
     */
    function updateMinimumPayoutAmount(uint256 newAmount) external onlyOwner {
        minimumPayoutAmount = newAmount;
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Deactivate creator (emergency)
     */
    function deactivateCreator(address creator) external onlyOwner {
        creatorProfiles[creator].isActive = false;
    }

    /**
     * @dev Emergency withdrawal function
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyOwner
    {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
}