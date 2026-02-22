/**
 * Web3 Dynamic Import Utilities
 *
 * These utilities provide easy dynamic imports for Web3 functionality.
 * This ensures Web3 code is only loaded when actually needed.
 */

type Web3WalletModule = typeof import('$lib/web3/wallet');
type Web3ContractsModule = typeof import('$lib/web3/contracts');

let web3WalletPromise: Promise<Web3WalletModule> | null = null;
let web3ContractsPromise: Promise<Web3ContractsModule> | null = null;

/**
 * Load Web3 wallet functions
 * Uses singleton pattern to avoid multiple loads
 */
export async function loadWeb3Lib(): Promise<Web3WalletModule> {
	if (!web3WalletPromise) {
		web3WalletPromise = import('$lib/web3/wallet');
	}
	return web3WalletPromise;
}

/**
 * Load Web3 contract functions
 */
async function loadWeb3Contracts(): Promise<Web3ContractsModule> {
	if (!web3ContractsPromise) {
		web3ContractsPromise = import('$lib/web3/contracts');
	}
	return web3ContractsPromise;
}

/**
 * Connect wallet with lazy loading
 * Only loads Web3 code when user clicks connect
 */
export async function lazyConnectWallet(connectorType?: 'injected' | 'walletConnect' | 'coinbase') {
	const { connectWallet } = await loadWeb3Lib();
	return connectWallet(connectorType);
}

/**
 * Disconnect wallet with lazy loading
 */
export async function lazyDisconnectWallet() {
	const { disconnectWallet } = await loadWeb3Lib();
	return disconnectWallet();
}

/**
 * Get user balances with lazy loading
 */
export async function lazyGetUserBalances(address: string) {
	const { getUserBalances } = await loadWeb3Contracts();
	return getUserBalances(address);
}

/**
 * Check user access with lazy loading
 */
export async function lazyCheckUserAccess(address: string) {
	const { checkUserAccess } = await loadWeb3Contracts();
	return checkUserAccess(address);
}

/**
 * Preload Web3 modules
 * Call this to start loading Web3 in the background
 */
export function preloadWeb3() {
	loadWeb3Lib().catch(err => {
		console.warn('Failed to preload Web3 lib:', err);
	});
	loadWeb3Contracts().catch(err => {
		console.warn('Failed to preload Web3 contracts:', err);
	});
}

/**
 * Check if Web3 is supported in current environment
 */
export function isWeb3Supported(): boolean {
	if (typeof window === 'undefined') return false;
	return true;
}

/**
 * Check if user has a wallet extension installed
 */
export function hasWalletExtension(): boolean {
	if (typeof window === 'undefined') return false;
	return !!(window as any).ethereum;
}
