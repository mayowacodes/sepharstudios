// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Mock USDC Token
 * @dev Mock USDC token for testing purposes
 * Mimics the real USDC token with 6 decimal places
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("USD Coin", "USDC") {
        // Mint initial supply for testing
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M USDC
    }

    /**
     * @dev USDC has 6 decimal places
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @dev Mint tokens for testing
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}