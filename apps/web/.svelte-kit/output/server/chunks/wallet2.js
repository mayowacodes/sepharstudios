import { Bt as writable, Lt as derived } from "./ui-libs.js";
import "./index-server.js";
import { n as config, t as DEFAULT_CHAIN } from "./config.js";
import { connect, disconnect, getAccount, switchChain } from "@wagmi/core";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
//#region src/lib/web3/wallet.ts
/**
* Wallet connection state store
*/
var account = writable(void 0);
if (typeof window !== "undefined") account.set(getAccount(config));
/**
* Derived store for wallet address
*/
var walletAddress = derived(account, ($account) => $account?.address);
/**
* Derived store for connection status
*/
var isConnected = derived(account, ($account) => $account?.isConnected ?? false);
/**
* Disconnect/switch generation counter. Increments every time the user
* disconnects or switches wallets. Long-running async operations (contract
* reads, balance fetches) can capture the value at start and bail out if it
* changed by the time they resolve, avoiding stale-data UI bugs.
*
* Usage:
*   const gen = $walletGeneration;
*   const balance = await stcToken.balanceOf($walletAddress!);
*   if (gen !== $walletGeneration) return;  // wallet changed; discard result
*/
var walletGeneration = writable(0);
function bumpGeneration() {
	walletGeneration.update((n) => n + 1);
	cachedAccount = null;
	cachedAtGeneration = -1;
}
/**
* Cached `getAccount(config)` snapshot, invalidated on every wallet generation
* bump (connect / disconnect / chain switch). Callers in tight loops (e.g.
* accessControl helpers invoked per-component) can hit this instead of
* paying for the wagmi store read each time.
*/
var cachedAccount = null;
var cachedAtGeneration = -1;
/**
* Update account store with current account state
*/
function updateAccountState() {
	const currentAccount = getAccount(config);
	account.set(currentAccount);
}
/**
* Connect wallet with specified connector
*/
async function connectWallet(connectorType = "injected") {
	try {
		const connector = {
			injected: injected(),
			walletConnect: walletConnect({ projectId: "bbcddcc5afbf6cd4b9daface6c2aa284" }),
			coinbase: coinbaseWallet({ appName: "StudioChain" })
		}[connectorType];
		const result = await connect(config, { connector });
		if (result.chainId !== DEFAULT_CHAIN.id) await switchChain(config, { chainId: DEFAULT_CHAIN.id });
		updateAccountState();
		bumpGeneration();
		return result;
	} catch (error) {
		console.error("Failed to connect wallet:", error);
		updateAccountState();
		throw error;
	}
}
/**
* Disconnect wallet
*/
async function disconnectWallet() {
	try {
		await disconnect(config);
		updateAccountState();
		bumpGeneration();
	} catch (error) {
		console.error("Failed to disconnect wallet:", error);
		throw error;
	}
}
/**
* Auto-connect wallet if previously connected
*/
async function autoConnect() {
	try {
		if (localStorage.getItem("wagmi.wallet")) {
			updateAccountState();
			const currentAccount = getAccount(config);
			if (currentAccount.isConnected && currentAccount.address) console.log("Auto-connected to wallet:", currentAccount.address);
		}
	} catch (error) {
		console.error("Auto-connect failed:", error);
	}
}
/**
* Get formatted wallet address (shortened)
*/
function formatAddress(address, length = 4) {
	if (!address) return "";
	return `${address.slice(0, 2 + length)}...${address.slice(-length)}`;
}
if (typeof window !== "undefined") autoConnect();
//#endregion
export { isConnected as a, formatAddress as i, connectWallet as n, walletAddress as o, disconnectWallet as r, walletGeneration as s, account as t };
