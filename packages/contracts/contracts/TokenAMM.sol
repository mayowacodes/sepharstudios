// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StudioToken.sol";

/**
 * @title LP Token for StudioChain AMM
 * @dev ERC20 token representing liquidity provider shares
 */
contract LPToken is ERC20, Ownable {
    constructor() ERC20("StudioChain LP", "STC-LP") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

/**
 * @title StudioChain Token Automated Market Maker (AMM)
 * @dev Refactored AMM for STC/USDC with LP tokens, revenue multiplier, buyback and fee mechanics
 */
contract TokenAMM is Ownable, ReentrancyGuard, Pausable {
    StudioToken public stcToken;
    IERC20 public usdcToken;
    address public treasury; // protocol fee receiver

    LPToken public lpToken;

    // Pool state
    uint256 public stcReserve;
    uint256 public usdcReserve;

    // Platform revenue integration
    uint256 public monthlyPlatformRevenue; // in USDC (6 decimals)
    uint256 public buybackReserve; // accumulated USDC for buybacks
    uint256 public buybackPercentage = 800; // 8% of revenue (basis points)
    uint256 public lastRevenueUpdate;

    // Trading fees
    uint256 public tradingFee = 30; // 0.3% in basis points (10000 = 100%)
    uint256 public protocolFeeShare = 10; // 10% of fees to protocol treasury

    // Trade limits
    uint256 public maxPriceImpact = 500; // 5% max price impact
    uint256 public maxTradeSize = 100000 * 1e18; // Max STC per trade

    // Events
    event LiquidityAdded(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 lpMinted);
    event LiquidityRemoved(address indexed provider, uint256 stcAmount, uint256 usdcAmount, uint256 lpBurned);
    event TokenSwapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event BuybackExecuted(uint256 usdcUsed, uint256 stcBurned);
    event RevenueUpdated(uint256 newRevenue, uint256 timestamp);

    constructor(address _stcToken, address _usdcToken, address _treasury) {
        stcToken = StudioToken(_stcToken);
        usdcToken = IERC20(_usdcToken);
        treasury = _treasury;
        lpToken = new LPToken();
        lpToken.transferOwnership(address(this)); // AMM controls LP mint/burn
    }

    // ---------------------------
    // Liquidity
    // ---------------------------

    function addLiquidity(uint256 stcAmount, uint256 usdcAmount, uint256 minLp)
        external nonReentrant whenNotPaused returns (uint256 lpMinted)
    {
        require(stcAmount > 0 && usdcAmount > 0, "Invalid amounts");

        require(stcToken.transferFrom(msg.sender, address(this), stcAmount), "STC transfer failed");
        require(usdcToken.transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        if (lpToken.totalSupply() == 0) {
            // initial liquidity
            lpMinted = _sqrt(stcAmount * usdcAmount);
        } else {
            uint256 stcShare = (stcAmount * lpToken.totalSupply()) / stcReserve;
            uint256 usdcShare = (usdcAmount * lpToken.totalSupply()) / usdcReserve;
            lpMinted = stcShare < usdcShare ? stcShare : usdcShare;
        }

        require(lpMinted >= minLp, "Slippage: insufficient LP minted");

        stcReserve += stcAmount;
        usdcReserve += usdcAmount;
        lpToken.mint(msg.sender, lpMinted);

        emit LiquidityAdded(msg.sender, stcAmount, usdcAmount, lpMinted);
    }

    function removeLiquidity(uint256 lpAmount, uint256 minStc, uint256 minUsdc)
        external nonReentrant whenNotPaused returns (uint256 stcOut, uint256 usdcOut)
    {
        require(lpAmount > 0, "Invalid LP amount");
        uint256 totalSupply = lpToken.totalSupply();

        stcOut = (lpAmount * stcReserve) / totalSupply;
        usdcOut = (lpAmount * usdcReserve) / totalSupply;
        require(stcOut >= minStc && usdcOut >= minUsdc, "Slippage: insufficient output");

        stcReserve -= stcOut;
        usdcReserve -= usdcOut;
        lpToken.burn(msg.sender, lpAmount);

        require(stcToken.transfer(msg.sender, stcOut), "STC transfer failed");
        require(usdcToken.transfer(msg.sender, usdcOut), "USDC transfer failed");

        emit LiquidityRemoved(msg.sender, stcOut, usdcOut, lpAmount);
    }

    // ---------------------------
    // Swaps
    // ---------------------------

    function swapSTCForUSDC(uint256 stcIn, uint256 minUsdcOut)
        external nonReentrant whenNotPaused returns (uint256 usdcOut)
    {
        require(stcIn > 0 && stcIn <= maxTradeSize, "Invalid input");

        uint256 priceImpact = _calculatePriceImpact(stcIn, stcReserve, usdcReserve);
        require(priceImpact <= maxPriceImpact, "Price impact too high");

        uint256 feeToProtocol;
        (usdcOut, feeToProtocol) = _getAmountOutWithFee(stcIn, stcReserve, usdcReserve);
        require(usdcOut >= minUsdcOut, "Slippage: insufficient output");

        require(stcToken.transferFrom(msg.sender, address(this), stcIn), "STC transfer failed");

        stcReserve += stcIn;
        usdcReserve -= usdcOut;
        require(usdcToken.transfer(msg.sender, usdcOut), "USDC transfer failed");

        if (feeToProtocol > 0) {
            require(usdcToken.transfer(treasury, feeToProtocol), "Protocol fee transfer failed");
        }

        emit TokenSwapped(msg.sender, address(stcToken), address(usdcToken), stcIn, usdcOut);
    }

    function swapUSDCForSTC(uint256 usdcIn, uint256 minStcOut)
        external nonReentrant whenNotPaused returns (uint256 stcOut)
    {
        require(usdcIn > 0, "Invalid input");

        uint256 feeToProtocol;
        (stcOut, feeToProtocol) = _getAmountOutWithFee(usdcIn, usdcReserve, stcReserve);
        require(stcOut >= minStcOut && stcOut <= maxTradeSize, "Slippage or trade too large");

        uint256 priceImpact = _calculatePriceImpact(usdcIn, usdcReserve, stcReserve);
        require(priceImpact <= maxPriceImpact, "Price impact too high");

        require(usdcToken.transferFrom(msg.sender, address(this), usdcIn), "USDC transfer failed");

        usdcReserve += usdcIn;
        stcReserve -= stcOut;
        require(stcToken.transfer(msg.sender, stcOut), "STC transfer failed");

        if (feeToProtocol > 0) {
            require(stcToken.transfer(treasury, feeToProtocol), "Protocol fee transfer failed");
        }

        emit TokenSwapped(msg.sender, address(usdcToken), address(stcToken), usdcIn, stcOut);
    }

    // ---------------------------
    // Buybacks & Revenue
    // ---------------------------

    function executeBuyback(uint256 usdcAmount) external onlyOwner nonReentrant whenNotPaused {
        require(usdcAmount > 0 && usdcAmount <= buybackReserve, "Invalid buyback amount");

        (uint256 stcBought,) = _getAmountOutWithFee(usdcAmount, usdcReserve, stcReserve);

        usdcReserve += usdcAmount;
        stcReserve -= stcBought;
        buybackReserve -= usdcAmount;

        stcToken.burn(stcBought);
        emit BuybackExecuted(usdcAmount, stcBought);
    }

    function updatePlatformRevenue(uint256 newRevenue) external onlyOwner {
        monthlyPlatformRevenue = newRevenue;
        lastRevenueUpdate = block.timestamp;
        uint256 buybackAmt = (newRevenue * buybackPercentage) / 10000;
        buybackReserve += buybackAmt;
        emit RevenueUpdated(newRevenue, block.timestamp);
    }

    // ---------------------------
    // Views
    // ---------------------------

    function getSTCPrice() external view returns (uint256) {
        if (stcReserve == 0 || usdcReserve == 0) return 0;
        uint256 basePrice = (usdcReserve * 1e18) / stcReserve;
        uint256 multiplier = _calculateRevenueMultiplier();
        return (basePrice * multiplier) / 100; // basis points scaling
    }

    function getPoolInfo() external view returns (uint256, uint256, uint256, uint256, uint256) {
        return (stcReserve, usdcReserve, lpToken.totalSupply(), this.getSTCPrice(), monthlyPlatformRevenue);
    }

    /**
     * @dev Get STC amount out for a given USDC amount
     */
    function getStcAmountOut(uint256 usdcAmount) external view returns (uint256) {
        if (usdcReserve == 0 || stcReserve == 0) return 0;
        (uint256 stcOut,) = _getAmountOutWithFee(usdcAmount, usdcReserve, stcReserve);
        return stcOut;
    }

    // ---------------------------
    // Internal Math
    // ---------------------------

    function _getAmountOutWithFee(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        internal view returns (uint256 amountOut, uint256 protocolFee)
    {
        require(reserveIn > 0 && reserveOut > 0, "No liquidity");

        uint256 fee = (amountIn * tradingFee) / 10000;
        uint256 amountInAfterFee = amountIn - fee;
        protocolFee = (fee * protocolFeeShare) / 100;

        uint256 numerator = amountInAfterFee * reserveOut;
        uint256 denominator = reserveIn + amountInAfterFee;
        amountOut = numerator / denominator;
    }

    function _calculatePriceImpact(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        internal pure returns (uint256 impactBps)
    {
        uint256 priceBefore = (reserveOut * 1e18) / reserveIn;
        uint256 newReserveIn = reserveIn + amountIn;
        uint256 amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
        uint256 newReserveOut = reserveOut - amountOut;
        uint256 priceAfter = (newReserveOut * 1e18) / newReserveIn;
        if (priceAfter >= priceBefore) return 0;
        impactBps = ((priceBefore - priceAfter) * 10000) / priceBefore;
    }

    function _calculateRevenueMultiplier() internal view returns (uint256) {
        if (monthlyPlatformRevenue == 0) return 100; // 1.0x
        uint256 revenueUSD = monthlyPlatformRevenue / 1e6; // convert from 6 decimals
        uint256 revenueInK = revenueUSD / 1000; // thousands of USD
        uint256 multiplier = 100 + (revenueInK * 5);
        return multiplier > 300 ? 300 : multiplier; // capped at 3.0x
    }

    function _sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    // ---------------------------
    // Admin
    // ---------------------------

    function updateTradingParameters(uint256 _tradingFee, uint256 _maxImpact, uint256 _maxTradeSize)
        external onlyOwner
    {
        require(_tradingFee <= 100, "Fee too high");
        require(_maxImpact <= 1000, "Impact too high");
        tradingFee = _tradingFee;
        maxPriceImpact = _maxImpact;
        maxTradeSize = _maxTradeSize;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(stcToken) && token != address(usdcToken), "Cannot withdraw core reserves");
        IERC20(token).transfer(owner(), amount);
    }
}
