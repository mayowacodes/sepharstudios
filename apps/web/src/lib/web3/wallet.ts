import { connect, disconnect, getAccount, switchChain } from '@wagmi/core'
import { config, DEFAULT_CHAIN, type SupportedChainId } from './config'
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors'
import { writable, derived } from 'svelte/store'
import type { GetAccountReturnType } from '@wagmi/core'

/**
 * Wallet connection state store
 */
export const account = writable<GetAccountReturnType | undefined>(undefined)

// Initialize account state immediately
if (typeof window !== 'undefined') {
  account.set(getAccount(config))
}

/**
 * Derived store for wallet address
 */
export const walletAddress = derived(account, ($account) => $account?.address)

/**
 * Derived store for connection status
 */
export const isConnected = derived(account, ($account) => $account?.isConnected ?? false)

/**
 * Update account store with current account state
 */
export function updateAccountState() {
  const currentAccount = getAccount(config)
  account.set(currentAccount)
}

/**
 * Connect wallet with specified connector
 */
export async function connectWallet(connectorType: 'injected' | 'walletConnect' | 'coinbase' = 'injected') {
  try {
    const connectorMap = {
      injected: injected(),
      walletConnect: walletConnect({ projectId: 'bbcddcc5afbf6cd4b9daface6c2aa284' }),
      coinbase: coinbaseWallet({ appName: 'StudioChain' })
    }

    const connector = connectorMap[connectorType]

    const result = await connect(config, { connector })

    // Switch to default chain if not already on it
    if (result.chainId !== DEFAULT_CHAIN.id) {
      await switchChain(config, { chainId: DEFAULT_CHAIN.id })
    }

    updateAccountState()
    return result
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    updateAccountState()
    throw error
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet() {
  try {
    await disconnect(config)
    updateAccountState()
  } catch (error) {
    console.error('Failed to disconnect wallet:', error)
    throw error
  }
}

/**
 * Switch to a different chain
 */
export async function switchToChain(chainId: SupportedChainId) {
  try {
    await switchChain(config, { chainId })
    updateAccountState()
  } catch (error) {
    console.error('Failed to switch chain:', error)
    throw error
  }
}

/**
 * Auto-connect wallet if previously connected
 */
export async function autoConnect() {
  try {
    // Check if there was a previous connection
    const isAutoConnect = localStorage.getItem('wagmi.wallet')

    if (isAutoConnect) {
      // Try to reconnect
      updateAccountState()

      const currentAccount = getAccount(config)
      if (currentAccount.isConnected && currentAccount.address) {
        console.log('Auto-connected to wallet:', currentAccount.address)
      }
    }
  } catch (error) {
    console.error('Auto-connect failed:', error)
  }
}

/**
 * Get formatted wallet address (shortened)
 */
export function formatAddress(address: string, length: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`
}

/**
 * Check if user is on correct network
 */
export function isOnCorrectNetwork(chainId?: number): boolean {
  if (!chainId) return false
  return [137, 80001, 31337].includes(chainId) // Polygon, Mumbai, localhost
}

/**
 * Prompt user to switch to correct network
 */
export async function promptNetworkSwitch() {
  try {
    await switchToChain(DEFAULT_CHAIN.id)
    return true
  } catch (error) {
    console.error('Network switch failed:', error)
    return false
  }
}

/**
 * Wallet connection hook for Svelte components
 */
export function useWallet() {
  let unsubscribe: (() => void) | null = null

  function subscribe() {
    // Update account state periodically
    const interval = setInterval(updateAccountState, 1000)

    unsubscribe = () => {
      clearInterval(interval)
    }
  }

  function destroy() {
    if (unsubscribe) {
      unsubscribe()
    }
  }

  return {
    subscribe,
    destroy,
    connect: connectWallet,
    disconnect: disconnectWallet,
    switchChain: switchToChain,
    formatAddress
  }
}

/**
 * Check wallet connection and prompt connection if needed
 */
export async function ensureWalletConnected(): Promise<string> {
  const currentAccount = getAccount(config)

  if (!currentAccount.isConnected || !currentAccount.address) {
    throw new Error('Please connect your wallet first')
  }

  return currentAccount.address
}

/**
 * Transaction helpers
 */
export class TransactionHelper {
  static async waitForTransaction(hash: string, timeout: number = 30000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Transaction timeout'))
      }, timeout)

      // This is a simplified version - in production, you'd want to use wagmi's waitForTransaction
      const checkTransaction = async () => {
        try {
          // Check transaction status
          // Implementation depends on your RPC provider
          clearTimeout(timeoutId)
          resolve(true)
        } catch (error) {
          clearTimeout(timeoutId)
          reject(error)
        }
      }

      checkTransaction()
    })
  }

  static formatTransactionError(error: Error | unknown): string {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('User rejected')) {
      return 'Transaction was cancelled by user'
    }

    if (message.includes('insufficient funds')) {
      return 'Insufficient funds for transaction'
    }

    if (message.includes('gas')) {
      return 'Transaction failed due to gas issues'
    }

    return message || 'Transaction failed'
  }
}

// Initialize auto-connect when module loads (browser only)
if (typeof window !== 'undefined') {
  autoConnect()
}