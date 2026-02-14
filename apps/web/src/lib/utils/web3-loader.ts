/**
 * Web3 Dynamic Import Utilities
 *
 * These utilities provide easy dynamic imports for Web3 functionality.
 * This ensures Web3 code is only loaded when actually needed.
 */

type Web3Module = typeof import('@sephar/web3/lib');
type Web3Components = typeof import('@sephar/web3/components');

let web3LibPromise: Promise<Web3Module> | null = null;
let web3ComponentsPromise: Promise<Web3Components> | null = null;

/**
 * Load Web3 library functions
 * Uses singleton pattern to avoid multiple loads
 */
export async function loadWeb3Lib(): Promise<Web3Module> {
	if (!web3LibPromise) {
		web3LibPromise = import('@sephar/web3/lib');
	}
	return web3LibPromise;
}

/**
 * Load Web3 components
 * Uses singleton pattern to avoid multiple loads
 */
export async function loadWeb3Components(): Promise<Web3Components> {
	if (!web3ComponentsPromise) {
		web3ComponentsPromise = import('@sephar/web3/components');
	}
	return web3ComponentsPromise;
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
	const { getUserBalances } = await loadWeb3Lib();
	return getUserBalances(address);
}

/**
 * Check user access with lazy loading
 */
export async function lazyCheckUserAccess(address: string) {
	const { checkUserAccess } = await loadWeb3Lib();
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
	loadWeb3Components().catch(err => {
		console.warn('Failed to preload Web3 components:', err);
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