import { createConfig, http } from '@wagmi/core'
import { mainnet, polygon, polygonMumbai, localhost } from '@wagmi/core/chains'
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'

// WalletConnect Project ID
const projectId = 'bbcddcc5afbf6cd4b9daface6c2aa284'

export const config = createConfig({
  chains: [polygon, polygonMumbai, localhost, mainnet],
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
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/jDZ151u9mGIroWRG3tE_9'),
    [polygonMumbai.id]: http('https://rpc-mumbai.maticvigil.com'),
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
  [polygonMumbai.id]: {
    studioToken: '',
    sepharSubscription: '',
    creatorPayments: '',
    tokenAMM: '',
    usdcToken: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e' // Mumbai testnet USDC
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
export const SUPPORTED_CHAINS = [polygon, polygonMumbai, localhost] as const
export const DEFAULT_CHAIN = polygonMumbai // Start with testnet

export type SupportedChainId = typeof SUPPORTED_CHAINS[number]['id']

/**
 * Get contract addresses for a specific chain
 */
export function getContractAddresses(chainId: SupportedChainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonMumbai.id]
}