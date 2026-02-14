import { createConfig, http } from '@wagmi/core'
import { mainnet, polygon, polygonAmoy, localhost } from '@wagmi/core/chains'
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'

// Get WalletConnect Project ID from environment
const projectId = typeof process !== 'undefined'
  ? process.env.PUBLIC_WALLETCONNECT_PROJECT_ID || 'bbcddcc5afbf6cd4b9daface6c2aa284'
  : 'bbcddcc5afbf6cd4b9daface6c2aa284'

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
    [polygon.id]: http(
      typeof process !== 'undefined' && process.env.POLYGON_RPC_URL
        ? process.env.POLYGON_RPC_URL
        : 'https://polygon-rpc.com'
    ),
    [polygonAmoy.id]: http(
      typeof process !== 'undefined' && process.env.AMOY_RPC_URL
        ? process.env.AMOY_RPC_URL
        : 'https://rpc-amoy.polygon.technology'
    ),
    [localhost.id]: http('http://127.0.0.1:8545'),
    [mainnet.id]: http('https://eth.llamarpc.com')
  }
})

// Contract addresses - these will be populated after deployment
export const CONTRACT_ADDRESSES = {
  [polygon.id]: {
    studioToken: '',
    sepharSubscription: '',
    creatorPayments: '',
    tokenAMM: '',
    usdcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' // Polygon USDC
  },
  [polygonAmoy.id]: {
    studioToken: '', // Deploy with: bun run deploy:amoy
    sepharSubscription: '',
    creatorPayments: '',
    tokenAMM: '',
    usdcToken: '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582' // Amoy testnet USDC
  },
  [localhost.id]: {
    studioToken: '',
    sepharSubscription: '',
    creatorPayments: '',
    tokenAMM: '',
    usdcToken: '' // Will be deployed locally
  }
}

// Export chain-specific configurations
export const SUPPORTED_CHAINS = [polygon, polygonAmoy, localhost] as const
export const DEFAULT_CHAIN = polygonAmoy // Start with Amoy testnet

export type SupportedChainId = typeof SUPPORTED_CHAINS[number]['id']

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: SupportedChainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonAmoy.id]
}