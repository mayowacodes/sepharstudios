// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FounderVesting
 * @dev Fix 1: Time-locks the 300M platform development allocation.
 *
 * Schedule:
 *   - Cliff:    6 months after deployment (nothing releases before this)
 *   - Duration: 48 months total linear vesting
 *   - Rate:     ~6.25M STC released per month after cliff
 *
 * This prevents the founding team from dumping the entire allocation at once,
 * which would be flagged as a rug-pull risk by investors and analysts.
 */
contract FounderVesting is Ownable {
    IERC20 public immutable stcToken;
    address public immutable beneficiary;

    uint256 public immutable vestingStart;   // timestamp when cliff begins counting
    uint256 public immutable cliffDuration;  // seconds until first release (6 months)
    uint256 public immutable vestingDuration; // total vesting period in seconds (48 months)

    uint256 public totalAllocated;
    uint256 public totalReleased;

    event TokensReleased(uint256 amount, uint256 timestamp);

    constructor(
        address _stcToken,
        address _beneficiary,
        uint256 _cliffMonths,
        uint256 _vestingMonths
    ) {
        require(_stcToken != address(0), "Invalid token");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_vestingMonths > _cliffMonths, "Vesting must exceed cliff");

        stcToken = IERC20(_stcToken);
        beneficiary = _beneficiary;
        vestingStart = block.timestamp;
        cliffDuration = _cliffMonths * 30 days;
        vestingDuration = _vestingMonths * 30 days;
    }

    /**
     * @dev Deposit tokens into the vesting contract.
     * Called once by the deployer after minting.
     */
    function deposit(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be positive");
        stcToken.transferFrom(msg.sender, address(this), amount);
        totalAllocated += amount;
    }

    /**
     * @dev Calculate how many tokens have vested so far.
     */
    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < vestingStart + cliffDuration) {
            return 0; // Still within cliff period
        }

        uint256 elapsed = block.timestamp - vestingStart;
        if (elapsed >= vestingDuration) {
            return totalAllocated; // Fully vested
        }

        return (totalAllocated * elapsed) / vestingDuration;
    }

    /**
     * @dev Release all currently vested tokens to beneficiary.
     */
    function release() external {
        require(msg.sender == beneficiary || msg.sender == owner(), "Not authorised");

        uint256 releasableAmount = vestedAmount() - totalReleased;
        require(releasableAmount > 0, "Nothing to release");

        totalReleased += releasableAmount;
        stcToken.transfer(beneficiary, releasableAmount);

        emit TokensReleased(releasableAmount, block.timestamp);
    }

    /**
     * @dev View: how many tokens can be released right now.
     */
    function releasable() external view returns (uint256) {
        return vestedAmount() - totalReleased;
    }

    /**
     * @dev View: days remaining until cliff ends.
     */
    function cliffEndsIn() external view returns (uint256) {
        uint256 cliffEnd = vestingStart + cliffDuration;
        if (block.timestamp >= cliffEnd) return 0;
        return (cliffEnd - block.timestamp) / 1 days;
    }
}
