import { aq as derived$1, aY as writable } from './ui-libs-BjzLDLAh.js';
import { b as ConnectorAlreadyConnectedError, S as SwitchChainNotSupportedError, C as ChainNotConfiguredError, j as getConnection, h as config, f as coinbaseWallet, w as walletConnect, m as injected, D as DEFAULT_CHAIN } from './config-DS-2WH1m.js';

/** https://wagmi.sh/core/api/actions/connect */
async function connect(config, parameters) {
    // "Register" connector if not already created
    let connector;
    if (typeof parameters.connector === 'function') {
        connector = config._internal.connectors.setup(parameters.connector);
    }
    else
        connector = parameters.connector;
    // Check if connector is already connected
    if (connector.uid === config.state.current)
        throw new ConnectorAlreadyConnectedError();
    try {
        config.setState((x) => ({ ...x, status: 'connecting' }));
        connector.emitter.emit('message', { type: 'connecting' });
        const { connector: _, ...rest } = parameters;
        const data = await connector.connect(rest);
        connector.emitter.off('connect', config._internal.events.connect);
        connector.emitter.on('change', config._internal.events.change);
        connector.emitter.on('disconnect', config._internal.events.disconnect);
        await config.storage?.setItem('recentConnectorId', connector.id);
        config.setState((x) => ({
            ...x,
            connections: new Map(x.connections).set(connector.uid, {
                accounts: (rest.withCapabilities
                    ? data.accounts.map((account) => typeof account === 'object' ? account.address : account)
                    : data.accounts),
                chainId: data.chainId,
                connector: connector,
            }),
            current: connector.uid,
            status: 'connected',
        }));
        return {
            // TODO(v3): Remove `withCapabilities: true` default behavior so remove compat marshalling
            // Workaround so downstream connectors work with `withCapabilities` without any changes required
            accounts: (rest.withCapabilities
                ? data.accounts.map((address) => typeof address === 'object'
                    ? address
                    : { address, capabilities: {} })
                : data.accounts),
            chainId: data.chainId,
        };
    }
    catch (error) {
        config.setState((x) => ({
            ...x,
            // Keep existing connector connected in case of error
            status: x.current ? 'connected' : 'disconnected',
        }));
        throw error;
    }
}

/** https://wagmi.sh/core/api/actions/disconnect */
async function disconnect(config, parameters = {}) {
    let connector;
    if (parameters.connector)
        connector = parameters.connector;
    else {
        const { connections, current } = config.state;
        const connection = connections.get(current);
        connector = connection?.connector;
    }
    const connections = config.state.connections;
    if (connector) {
        await connector.disconnect();
        connector.emitter.off('change', config._internal.events.change);
        connector.emitter.off('disconnect', config._internal.events.disconnect);
        connector.emitter.on('connect', config._internal.events.connect);
        connections.delete(connector.uid);
    }
    config.setState((x) => {
        // if no connections exist, move to disconnected state
        if (connections.size === 0)
            return {
                ...x,
                connections: new Map(),
                current: null,
                status: 'disconnected',
            };
        // switch over to another connection
        const nextConnection = connections.values().next().value;
        return {
            ...x,
            connections: new Map(connections),
            current: nextConnection.connector.uid,
        };
    });
    // Set recent connector if exists
    {
        const current = config.state.current;
        if (!current)
            return;
        const connector = config.state.connections.get(current)?.connector;
        if (!connector)
            return;
        await config.storage?.setItem('recentConnectorId', connector.id);
    }
}

/** https://wagmi.sh/core/api/actions/switchChain */
async function switchChain(config, parameters) {
    const { addEthereumChainParameter, chainId } = parameters;
    const connection = config.state.connections.get(parameters.connector?.uid ?? config.state.current);
    if (connection) {
        const connector = connection.connector;
        if (!connector.switchChain)
            throw new SwitchChainNotSupportedError({ connector });
        const chain = await connector.switchChain({
            addEthereumChainParameter,
            chainId,
        });
        return chain;
    }
    const chain = config.chains.find((x) => x.id === chainId);
    if (!chain)
        throw new ChainNotConfiguredError();
    config.setState((x) => ({ ...x, chainId }));
    return chain;
}

//#region src/lib/web3/wallet.ts
/**
* Wallet connection state store
*/
var account = writable(void 0);
if (typeof window !== "undefined") account.set(getConnection(config));
/**
* Derived store for wallet address
*/
var walletAddress = derived$1(account, ($account) => $account?.address);
/**
* Derived store for connection status
*/
var isConnected = derived$1(account, ($account) => $account?.isConnected ?? false);
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
}
/**
* Update account store with current account state
*/
function updateAccountState() {
	const currentAccount = getConnection(config);
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
			const currentAccount = getConnection(config);
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

export { account as a, walletGeneration as b, connectWallet as c, disconnectWallet as d, formatAddress as f, isConnected as i, walletAddress as w };
//# sourceMappingURL=wallet2-C50kGu0q.js.map
