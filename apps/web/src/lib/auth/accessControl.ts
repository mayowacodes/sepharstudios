import { checkUserAccess, subscriptionContract } from '@sephar/web3/lib';
import { getAccount } from '@wagmi/core';
import { config } from '@sephar/web3/lib';

export type AccessTier = 'free' | 'basic' | 'premium' | 'creator';

export interface AccessLevel {
  level: AccessTier;
  hasAccess: boolean;
  reason?: string;
}

export interface ContentAccess {
  contentId: string;
  requiredTier: number; // 0=free, 1=basic, 2=premium, 3=creator
  requiresNFT?: boolean;
  requiresStaking?: boolean;
  minimumStakeAmount?: string;
}

/**
 * Check if user has access to specific content based on their wallet status
 */
export async function checkContentAccess(
  contentAccess: ContentAccess,
  userAddress?: string
): Promise<AccessLevel> {
  // Free content - always accessible
  if (contentAccess.requiredTier === 0) {
    return { level: 'free', hasAccess: true };
  }

  // If no address provided, try to get from connected wallet
  if (!userAddress) {
    try {
      const account = getAccount(config);
      if (account.address) {
        userAddress = account.address;
      } else {
        return {
          level: 'free',
          hasAccess: false,
          reason: 'Please connect your wallet to access premium content'
        };
      }
    } catch {
      return {
        level: 'free',
        hasAccess: false,
        reason: 'Please connect your wallet to access premium content'
      };
    }
  }

  try {
    // Get user's access status
    const userAccess = await checkUserAccess(userAddress);

    // Check NFT subscription access with direct contract validation
    if (contentAccess.requiresNFT) {
      if (!userAccess.hasSubscription) {
        // Double-check with direct contract call for accuracy
        try {
          const directSubscriptionStatus = await subscriptionContract.hasActiveSubscription(userAddress);
          if (!directSubscriptionStatus.hasAccess) {
            return {
              level: 'free',
              hasAccess: false,
              reason: 'This content requires an active NFT subscription'
            };
          }
          // Update userAccess with direct contract data if different
          userAccess.hasSubscription = directSubscriptionStatus.hasAccess;
          userAccess.subscriptionTier = directSubscriptionStatus.tier;
        } catch (error) {
          console.error('Direct subscription check failed:', error);
          return {
            level: 'free',
            hasAccess: false,
            reason: 'Unable to verify subscription status'
          };
        }
      }

      if (userAccess.subscriptionTier < contentAccess.requiredTier) {
        return {
          level: getTierName(userAccess.subscriptionTier),
          hasAccess: false,
          reason: `This content requires ${getTierName(contentAccess.requiredTier)} tier or higher`
        };
      }
    }

    // Check staking access
    if (contentAccess.requiresStaking && contentAccess.minimumStakeAmount) {
      const stakedAmount = parseFloat(userAccess.stakingAmount);
      const requiredAmount = parseFloat(contentAccess.minimumStakeAmount);

      if (stakedAmount < requiredAmount) {
        return {
          level: 'free',
          hasAccess: false,
          reason: `This content requires staking at least ${requiredAmount} STC tokens`
        };
      }
    }

    // General tier access check
    if (userAccess.hasSubscription && userAccess.subscriptionTier >= contentAccess.requiredTier) {
      return {
        level: getTierName(userAccess.subscriptionTier),
        hasAccess: true
      };
    }

    // Staking-based access
    if (parseFloat(userAccess.stakingAmount) > 0) {
      const stakedAmount = parseFloat(userAccess.stakingAmount);
      let stakingTier = 0;

      if (stakedAmount >= 1000) stakingTier = 3; // Creator level
      else if (stakedAmount >= 500) stakingTier = 2; // Premium level
      else if (stakedAmount >= 100) stakingTier = 1; // Basic level

      if (stakingTier >= contentAccess.requiredTier) {
        return {
          level: getTierName(stakingTier),
          hasAccess: true
        };
      }
    }

    return {
      level: 'free',
      hasAccess: false,
      reason: 'This content requires a subscription or sufficient STC token staking'
    };

  } catch (error) {
    console.error('Error checking content access:', error);
    return {
      level: 'free',
      hasAccess: false,
      reason: 'Unable to verify access. Please try connecting your wallet again.'
    };
  }
}

/**
 * Middleware for SvelteKit routes to check access
 */
export async function validateRouteAccess(
  contentAccess: ContentAccess,
  userAddress?: string
): Promise<{ authorized: boolean; redirectTo?: string; message?: string }> {
  const access = await checkContentAccess(contentAccess, userAddress);

  if (access.hasAccess) {
    return { authorized: true };
  }

  // Determine appropriate redirect
  if (!userAddress) {
    return {
      authorized: false,
      redirectTo: '/wallet',
      message: 'Please connect your wallet to access this content'
    };
  }

  if (contentAccess.requiresNFT) {
    return {
      authorized: false,
      redirectTo: '/subscription',
      message: access.reason || 'Subscription required'
    };
  }

  return {
    authorized: false,
    redirectTo: '/plans',
    message: access.reason || 'Premium access required'
  };
}

/**
 * Component helper to show appropriate upgrade prompts
 */
export function getUpgradeAction(contentAccess: ContentAccess, currentLevel: AccessLevel) {
  if (!currentLevel.hasAccess) {
    if (contentAccess.requiresNFT) {
      return {
        action: 'subscribe',
        text: 'Get NFT Subscription',
        href: '/subscription',
        tier: getTierName(contentAccess.requiredTier)
      };
    }

    if (contentAccess.requiresStaking) {
      return {
        action: 'stake',
        text: `Stake ${contentAccess.minimumStakeAmount} STC`,
        href: '/tokens',
        tier: getTierName(contentAccess.requiredTier)
      };
    }

    return {
      action: 'upgrade',
      text: 'Upgrade Plan',
      href: '/plans',
      tier: getTierName(contentAccess.requiredTier)
    };
  }

  return null;
}

/**
 * Helper function to get tier name
 */
function getTierName(tier: number): AccessTier {
  const tiers: AccessTier[] = ['free', 'basic', 'premium', 'creator'];
  return tiers[tier] || 'free';
}

/**
 * Content classification helpers
 */
export const CONTENT_TIERS = {
  FREE: { requiredTier: 0, requiresNFT: false },
  BASIC: { requiredTier: 1, requiresNFT: true },
  PREMIUM: { requiredTier: 2, requiresNFT: true },
  CREATOR: { requiredTier: 3, requiresNFT: true }
} as const;

export const STAKING_TIERS = {
  BASIC: { minimumStakeAmount: '100', requiredTier: 1, requiresStaking: true },
  PREMIUM: { minimumStakeAmount: '500', requiredTier: 2, requiresStaking: true },
  CREATOR: { minimumStakeAmount: '1000', requiredTier: 3, requiresStaking: true }
} as const;

/**
 * Comprehensive access check using all available contract methods
 */
export async function validateUserAccessComprehensive(
  contentAccess: ContentAccess
): Promise<AccessLevel & {
  walletConnected: boolean;
  accountAddress?: string;
  subscriptionTier?: number;
  stakingAmount?: string;
  stakingDiscount?: number;
  hasSubscription?: boolean;
}> {
  try {
    const account = getAccount(config);

    if (!account.address || !account.isConnected) {
      return {
        level: 'free',
        hasAccess: false,
        walletConnected: false,
        reason: 'Wallet not connected. Please connect your wallet to access premium content.'
      };
    }

    const [userAccess, subscriptionStatus] = await Promise.all([
      checkUserAccess(account.address),
      subscriptionContract.getSubscriptionStatus(account.address)
    ]);

    const result = await checkContentAccess(contentAccess, account.address);

    if (contentAccess.requiresNFT && subscriptionStatus.isActive) {
      const currentTime = Date.now() / 1000;
      if (subscriptionStatus.expiryDate < currentTime) {
        return {
          level: 'free',
          hasAccess: false,
          walletConnected: true,
          accountAddress: account.address,
          reason: 'Your NFT subscription has expired. Please renew to continue accessing premium content.'
        };
      }
    }

    const enhancedResult = {
      ...result,
      walletConnected: true,
      accountAddress: account.address,
      subscriptionTier: userAccess.subscriptionTier,
      stakingAmount: userAccess.stakingAmount,
      stakingDiscount: userAccess.stakingDiscount,
      hasSubscription: userAccess.hasSubscription
    };

    if (!result.hasAccess && userAccess.hasAccess) {
      enhancedResult.hasAccess = true;
      enhancedResult.level = userAccess.hasSubscription
        ? getTierName(userAccess.subscriptionTier)
        : 'basic';
      enhancedResult.reason = undefined;
    }

    return enhancedResult;

  } catch (error) {
    console.error('Comprehensive access validation failed:', error);

    try {
      const account = getAccount(config);
      return {
        level: 'free',
        hasAccess: false,
        walletConnected: account.isConnected,
        accountAddress: account.address,
        reason: 'Unable to verify access due to network issues. Please try again.'
      };
    } catch {
      return {
        level: 'free',
        hasAccess: false,
        walletConnected: false,
        reason: 'Wallet connection error. Please reconnect your wallet.'
      };
    }
  }
}

/**
 * Quick wallet status check
 */
export function getWalletStatus() {
  try {
    const account = getAccount(config);
    return {
      isConnected: account.isConnected,
      address: account.address,
      connector: account.connector?.name,
      chainId: account.chainId
    };
  } catch (error) {
    console.error('Error getting wallet status:', error);
    return {
      isConnected: false,
      address: undefined,
      connector: undefined,
      chainId: undefined
    };
  }
}
