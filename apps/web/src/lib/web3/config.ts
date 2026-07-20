import { createConfig, http } from '@wagmi/core'
import { mainnet, polygon, polygonAmoy, localhost } from '@wagmi/core/chains'
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'
import { env as publicEnv } from '$env/dynamic/public'

/**
 * Web3 chain + contract configuration.
 *
 * Testnet is AMOY (chainId 80002) — Mumbai (80001) was decommissioned
 * by Polygon in April 2024; its RPC endpoints are dead. The Hardhat
 * project at packages/contracts already targets amoy (`bun run
 * deploy:amoy`).
 *
 * Contract addresses come from PUBLIC_* env vars so going live is a
 * Dokploy env change + restart, not a code edit:
 *
 *   PUBLIC_WEB3_CHAIN                = amoy | polygon   (default amoy)
 *   PUBLIC_STUDIO_TOKEN_ADDRESS      = 0x…  (StudioToken / STC)
 *   PUBLIC_SUBSCRIPTION_ADDRESS      = 0x…  (SepharSubscription)
 *   PUBLIC_CREATOR_PAYMENTS_ADDRESS  = 0x…  (CreatorPayments)
 *   PUBLIC_TOKEN_AMM_ADDRESS         = 0x…  (TokenAMM)
 *   PUBLIC_WALLETCONNECT_PROJECT_ID  = optional override
 *   PUBLIC_POLYGON_RPC_URL           = optional mainnet RPC override
 *
 * All four addresses are printed by `packages/contracts` deploy script
 * and saved to packages/contracts/deployments/<network>-<chainId>.json.
 * While they're unset, lib/web3/contracts.ts throws a descriptive
 * error instead of silently calling the zero address.
 */

// WalletConnect Project ID — env override, hardcoded fallback keeps
// local dev working without configuration.
const projectId = publicEnv.PUBLIC_WALLETCONNECT_PROJECT_ID || 'bbcddcc5afbf6cd4b9daface6c2aa284'

export const config = createConfig({
  chains: [polygon, polygonAmoy, localhost, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Sephar Studios',
        description: 'Premium streaming platform with Web3 integration',
        url: 'https://sepharstudios.com',
        icons: ['https://sepharstudios.com/icon.png']
      }
    }),
    coinbaseWallet({
      appName: 'Sephar Studios',
      appLogoUrl: 'https://sepharstudios.com/icon.png'
    })
  ],
  transports: {
    [polygon.id]: http(publicEnv.PUBLIC_POLYGON_RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/jDZ151u9mGIroWRG3tE_9'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [localhost.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http('https://eth.llamarpc.com')
  }
})

// Deployed contract addresses, filled from env for whichever chain is
// active. The inactive chain's entries stay empty so a wallet on the
// wrong network gets the descriptive requireAddress error rather than
// calls against addresses that only exist elsewhere.
const activeChain = (publicEnv.PUBLIC_WEB3_CHAIN || 'amoy').toLowerCase()
const envAddresses = {
  studioToken: publicEnv.PUBLIC_STUDIO_TOKEN_ADDRESS || '',
  sepharSubscription: publicEnv.PUBLIC_SUBSCRIPTION_ADDRESS || '',
  creatorPayments: publicEnv.PUBLIC_CREATOR_PAYMENTS_ADDRESS || '',
  tokenAMM: publicEnv.PUBLIC_TOKEN_AMM_ADDRESS || ''
}
const emptyAddresses = { studioToken: '', sepharSubscription: '', creatorPayments: '', tokenAMM: '' }

export const CONTRACT_ADDRESSES = {
  [polygon.id]: {
    ...(activeChain === 'polygon' ? envAddresses : emptyAddresses),
    usdcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // Polygon native USDC
  },
  [polygonAmoy.id]: {
    ...(activeChain === 'amoy' ? envAddresses : emptyAddresses),
    // Circle's official Amoy testnet USDC.
    usdcToken: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582'
  },
  [localhost.id]: {
    ...(activeChain === 'localhost' ? envAddresses : emptyAddresses),
    usdcToken: '' // MockUSDC — deployed locally by deploy:local
  }
}

// Export chain-specific configurations
export const SUPPORTED_CHAINS = [polygon, polygonAmoy, localhost] as const
export const DEFAULT_CHAIN = activeChain === 'polygon' ? polygon : polygonAmoy

export type SupportedChainId = typeof SUPPORTED_CHAINS[number]['id']

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: SupportedChainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonAmoy.id]
}
