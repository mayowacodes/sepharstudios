import { l as getAddress, v as numberToHex } from './stringify-CbXG6ciN.js';
import { v as defineChain, S as SwitchChainError, r as UserRejectedRequestError, K as withRetry, N as withTimeout, h as ResourceUnavailableRpcError, t as createClient, z as http } from './http-DCIt3x9N.js';
import { p as polygon } from './polygon-CgisD_XL.js';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

const localhost = /*#__PURE__*/ defineChain({
    id: 1_337,
    name: 'Localhost',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
    },
});

const mainnet = /*#__PURE__*/ defineChain({
    id: 1,
    name: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    blockTime: 12_000,
    rpcUrls: {
        default: {
            http: ['https://eth.merkle.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
            apiUrl: 'https://api.etherscan.io/api',
        },
    },
    contracts: {
        ensUniversalResolver: {
            address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
            blockCreated: 23_085_558,
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 14_353_601,
        },
    },
});

const polygonMumbai = /*#__PURE__*/ defineChain({
    id: 80_001,
    name: 'Polygon Mumbai',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://80001.rpc.thirdweb.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com',
            apiUrl: 'https://api-testnet.polygonscan.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        },
    },
    testnet: true,
});

const version = '3.5.0';

const getVersion = () => `@wagmi/core@${version}`;

var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseError_instances, _BaseError_walk;
class BaseError extends Error {
    get docsBaseUrl() {
        return 'https://wagmi.sh/core';
    }
    get version() {
        return getVersion();
    }
    constructor(shortMessage, options = {}) {
        super();
        _BaseError_instances.add(this);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'WagmiCoreError'
        });
        const details = options.cause instanceof BaseError
            ? options.cause.details
            : options.cause?.message
                ? options.cause.message
                : options.details;
        const docsPath = options.cause instanceof BaseError
            ? options.cause.docsPath || options.docsPath
            : options.docsPath;
        this.message = [
            shortMessage || 'An error occurred.',
            '',
            ...(options.metaMessages ? [...options.metaMessages, ''] : []),
            ...(docsPath
                ? [
                    `Docs: ${this.docsBaseUrl}${docsPath}.html${options.docsSlug ? `#${options.docsSlug}` : ''}`,
                ]
                : []),
            ...(details ? [`Details: ${details}`] : []),
            `Version: ${this.version}`,
        ].join('\n');
        if (options.cause)
            this.cause = options.cause;
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = options.metaMessages;
        this.shortMessage = shortMessage;
    }
    walk(fn) {
        return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, this, fn);
    }
}
_BaseError_instances = new WeakSet(), _BaseError_walk = function _BaseError_walk(err, fn) {
    if (fn?.(err))
        return err;
    if (err.cause)
        return __classPrivateFieldGet(this, _BaseError_instances, "m", _BaseError_walk).call(this, err.cause, fn);
    return err;
};

class ChainNotConfiguredError extends BaseError {
    constructor() {
        super('Chain not configured.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ChainNotConfiguredError'
        });
    }
}
class ConnectorAlreadyConnectedError extends BaseError {
    constructor() {
        super('Connector already connected.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorAlreadyConnectedError'
        });
    }
}
class ConnectorNotConnectedError extends BaseError {
    constructor() {
        super('Connector not connected.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorNotConnectedError'
        });
    }
}
class ConnectorAccountNotFoundError extends BaseError {
    constructor({ address, connector, }) {
        super(`Account "${address}" not found for connector "${connector.name}".`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorAccountNotFoundError'
        });
    }
}
class ConnectorChainMismatchError extends BaseError {
    constructor({ connectionChainId, connectorChainId, }) {
        super(`The current chain of the connector (id: ${connectorChainId}) does not match the connection's chain (id: ${connectionChainId}).`, {
            metaMessages: [
                `Current Chain ID:  ${connectorChainId}`,
                `Expected Chain ID: ${connectionChainId}`,
            ],
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorChainMismatchError'
        });
    }
}
class ConnectorUnavailableReconnectingError extends BaseError {
    constructor({ connector }) {
        super(`Connector "${connector.name}" unavailable while reconnecting.`, {
            details: [
                'During the reconnection step, the only connector methods guaranteed to be available are: `id`, `name`, `type`, `uid`.',
                'All other methods are not guaranteed to be available until reconnection completes and connectors are fully restored.',
                'This error commonly occurs for connectors that asynchronously inject after reconnection has already started.',
            ].join(' '),
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ConnectorUnavailableReconnectingError'
        });
    }
}

/** https://wagmi.sh/core/api/actions/getConnection */
function getConnection(config) {
    const uid = config.state.current;
    const connection = config.state.connections.get(uid);
    const addresses = connection?.accounts;
    const address = addresses?.[0];
    const chain = config.chains.find((chain) => chain.id === connection?.chainId);
    const status = config.state.status;
    switch (status) {
        case 'connected':
            return {
                address: address,
                addresses: addresses,
                chain,
                chainId: connection?.chainId,
                connector: connection?.connector,
                isConnected: true,
                isConnecting: false,
                isDisconnected: false,
                isReconnecting: false,
                status,
            };
        case 'reconnecting':
            return {
                address,
                addresses,
                chain,
                chainId: connection?.chainId,
                connector: connection?.connector,
                isConnected: !!address,
                isConnecting: false,
                isDisconnected: false,
                isReconnecting: true,
                status,
            };
        case 'connecting':
            return {
                address,
                addresses,
                chain,
                chainId: connection?.chainId,
                connector: connection?.connector,
                isConnected: false,
                isConnecting: true,
                isDisconnected: false,
                isReconnecting: false,
                status,
            };
        case 'disconnected':
            return {
                address: undefined,
                addresses: undefined,
                chain: undefined,
                chainId: undefined,
                connector: undefined,
                isConnected: false,
                isConnecting: false,
                isDisconnected: true,
                isReconnecting: false,
                status,
            };
    }
}

class ProviderNotFoundError extends BaseError {
    constructor() {
        super('Provider not found.');
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ProviderNotFoundError'
        });
    }
}
class SwitchChainNotSupportedError extends BaseError {
    constructor({ connector }) {
        super(`"${connector.name}" does not support programmatic chain switching.`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SwitchChainNotSupportedError'
        });
    }
}

function createConnector(createConnectorFn) {
    return createConnectorFn;
}

injected.type = 'injected';
function injected(parameters = {}) {
    const { shimDisconnect = true, unstable_shimAsyncInject } = parameters;
    function getTarget() {
        const target = parameters.target;
        if (typeof target === 'function') {
            const result = target();
            if (result)
                return result;
        }
        if (typeof target === 'object')
            return target;
        if (typeof target === 'string')
            return {
                ...(targetMap[target] ?? {
                    id: target,
                    name: `${target[0].toUpperCase()}${target.slice(1)}`,
                    provider: `is${target[0].toUpperCase()}${target.slice(1)}`,
                }),
            };
        return {
            id: 'injected',
            name: 'Injected',
            provider(window) {
                return window?.ethereum;
            },
        };
    }
    let accountsChanged;
    let chainChanged;
    let connect;
    let disconnect;
    return createConnector((config) => ({
        get icon() {
            return getTarget().icon;
        },
        get id() {
            return getTarget().id;
        },
        get name() {
            return getTarget().name;
        },
        type: injected.type,
        async setup() {
            const provider = await this.getProvider();
            // Only start listening for events if `target` is set, otherwise `injected()` will also receive events
            if (provider?.on && parameters.target) {
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider.on('connect', connect);
                }
                // We shouldn't need to listen for `'accountsChanged'` here since the `'connect'` event should suffice (and wallet shouldn't be connected yet).
                // Some wallets, like MetaMask, do not implement the `'connect'` event and overload `'accountsChanged'` instead.
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
            }
        },
        async connect({ chainId, isReconnecting, withCapabilities } = {}) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            let accounts = [];
            if (isReconnecting)
                accounts = await this.getAccounts().catch(() => []);
            else if (shimDisconnect) {
                // Attempt to show another prompt for selecting account if `shimDisconnect` flag is enabled
                try {
                    const permissions = await provider.request({
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }],
                    });
                    accounts = permissions[0]?.caveats?.[0]?.value?.map((x) => getAddress(x));
                    // `'wallet_requestPermissions'` can return a different order of accounts than `'eth_accounts'`
                    // switch to `'eth_accounts'` ordering if more than one account is connected
                    // https://github.com/wevm/wagmi/issues/4140
                    if (accounts.length > 0) {
                        const sortedAccounts = await this.getAccounts();
                        accounts = sortedAccounts;
                    }
                }
                catch (err) {
                    const error = err;
                    // Not all injected providers support `wallet_requestPermissions` (e.g. MetaMask iOS).
                    // Only bubble up error if user rejects request
                    if (error.code === UserRejectedRequestError.code)
                        throw new UserRejectedRequestError(error);
                    // Or prompt is already open
                    if (error.code === ResourceUnavailableRpcError.code)
                        throw error;
                }
            }
            try {
                if (!accounts?.length && !isReconnecting) {
                    const requestedAccounts = await provider.request({
                        method: 'eth_requestAccounts',
                    });
                    accounts = requestedAccounts.map((x) => getAddress(x));
                }
                // Manage EIP-1193 event listeners
                // https://eips.ethereum.org/EIPS/eip-1193#events
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code)
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                // Remove disconnected shim if it exists
                if (shimDisconnect)
                    await config.storage?.removeItem(`${this.id}.disconnected`);
                // Add connected shim if no target exists
                if (!parameters.target)
                    await config.storage?.setItem('injected.connected', true);
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (err) {
                const error = err;
                if (error.code === UserRejectedRequestError.code)
                    throw new UserRejectedRequestError(error);
                if (error.code === ResourceUnavailableRpcError.code)
                    throw new ResourceUnavailableRpcError(error);
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            // Manage EIP-1193 event listeners
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
            // Experimental support for MetaMask disconnect
            // https://github.com/MetaMask/metamask-improvement-proposals/blob/main/MIPs/mip-2.md
            try {
                // Adding timeout as not all wallets support this method and can hang
                // https://github.com/wevm/wagmi/issues/4064
                await withTimeout(() => 
                // TODO: Remove explicit type for viem@3
                provider.request({
                    // `'wallet_revokePermissions'` added in `viem@2.10.3`
                    method: 'wallet_revokePermissions',
                    params: [{ eth_accounts: {} }],
                }), { timeout: 100 });
            }
            catch { }
            // Add shim signalling connector is disconnected
            if (shimDisconnect) {
                await config.storage?.setItem(`${this.id}.disconnected`, true);
            }
            if (!parameters.target)
                await config.storage?.removeItem('injected.connected');
        },
        async getAccounts() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const accounts = await provider.request({ method: 'eth_accounts' });
            return accounts.map((x) => getAddress(x));
        },
        async getChainId() {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const hexChainId = await provider.request({ method: 'eth_chainId' });
            return Number(hexChainId);
        },
        async getProvider() {
            if (typeof window === 'undefined')
                return undefined;
            let provider;
            const target = getTarget();
            if (typeof target.provider === 'function')
                provider = target.provider(window);
            else if (typeof target.provider === 'string')
                provider = findProvider(window, target.provider);
            else
                provider = target.provider;
            // Some wallets do not conform to EIP-1193 (e.g. Trust Wallet)
            // https://github.com/wevm/wagmi/issues/3526#issuecomment-1912683002
            if (provider && !provider.removeListener) {
                // Try using `off` handler if it exists, otherwise noop
                if ('off' in provider && typeof provider.off === 'function')
                    provider.removeListener =
                        provider.off;
                else
                    provider.removeListener = () => { };
            }
            return provider;
        },
        async isAuthorized() {
            try {
                const isDisconnected = shimDisconnect &&
                    // If shim exists in storage, connector is disconnected
                    (await config.storage?.getItem(`${this.id}.disconnected`));
                if (isDisconnected)
                    return false;
                // Don't allow injected connector to connect if no target is set and it hasn't already connected
                // (e.g. flag in storage is not set). This prevents a targetless injected connector from connecting
                // automatically whenever there is a targeted connector configured.
                if (!parameters.target) {
                    const connected = await config.storage?.getItem('injected.connected');
                    if (!connected)
                        return false;
                }
                const provider = await this.getProvider();
                if (!provider) {
                    if (unstable_shimAsyncInject !== undefined &&
                        unstable_shimAsyncInject !== false) {
                        // If no provider is found, check for async injection
                        // https://github.com/wevm/references/issues/167
                        // https://github.com/MetaMask/detect-provider
                        const handleEthereum = async () => {
                            if (typeof window !== 'undefined')
                                window.removeEventListener('ethereum#initialized', handleEthereum);
                            const provider = await this.getProvider();
                            return !!provider;
                        };
                        const timeout = typeof unstable_shimAsyncInject === 'number'
                            ? unstable_shimAsyncInject
                            : 1_000;
                        const res = await Promise.race([
                            ...(typeof window !== 'undefined'
                                ? [
                                    new Promise((resolve) => window.addEventListener('ethereum#initialized', () => resolve(handleEthereum()), { once: true })),
                                ]
                                : []),
                            new Promise((resolve) => setTimeout(() => resolve(handleEthereum()), timeout)),
                        ]);
                        if (res)
                            return true;
                    }
                    throw new ProviderNotFoundError();
                }
                // Use retry strategy as some injected wallets (e.g. MetaMask) fail to
                // immediately resolve JSON-RPC requests on page load.
                const accounts = await withRetry(() => this.getAccounts());
                return !!accounts.length;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const chain = config.chains.find((x) => x.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            const promise = new Promise((resolve) => {
                const listener = ((data) => {
                    if ('chainId' in data && data.chainId === chainId) {
                        config.emitter.off('change', listener);
                        resolve();
                    }
                });
                config.emitter.on('change', listener);
            });
            try {
                await Promise.all([
                    provider
                        .request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: numberToHex(chainId) }],
                    })
                        // During `'wallet_switchEthereumChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
                        // If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
                        // To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
                        // this callback or an externally emitted `'chainChanged'` event.
                        // https://github.com/MetaMask/metamask-extension/issues/24247
                        .then(async () => {
                        const currentChainId = await this.getChainId();
                        if (currentChainId === chainId)
                            config.emitter.emit('change', { chainId });
                    }),
                    promise,
                ]);
                return chain;
            }
            catch (err) {
                const error = err;
                // Indicates chain is not added to provider
                if (error.code === 4902 ||
                    // Unwrapping for MetaMask Mobile
                    // https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
                    error
                        ?.data?.originalError?.code === 4902) {
                    try {
                        const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
                        let blockExplorerUrls;
                        if (addEthereumChainParameter?.blockExplorerUrls)
                            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                        else if (blockExplorer)
                            blockExplorerUrls = [
                                blockExplorer.url,
                                ...Object.values(blockExplorers).map((x) => x.url),
                            ];
                        let rpcUrls;
                        if (addEthereumChainParameter?.rpcUrls?.length)
                            rpcUrls = addEthereumChainParameter.rpcUrls;
                        else
                            rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];
                        const addEthereumChain = {
                            blockExplorerUrls,
                            chainId: numberToHex(chainId),
                            chainName: addEthereumChainParameter?.chainName ?? chain.name,
                            iconUrls: addEthereumChainParameter?.iconUrls,
                            nativeCurrency: addEthereumChainParameter?.nativeCurrency ??
                                chain.nativeCurrency,
                            rpcUrls,
                        };
                        await Promise.all([
                            provider
                                .request({
                                method: 'wallet_addEthereumChain',
                                params: [addEthereumChain],
                            })
                                .then(async () => {
                                const currentChainId = await this.getChainId();
                                if (currentChainId === chainId)
                                    config.emitter.emit('change', { chainId });
                                else
                                    throw new UserRejectedRequestError(new Error('User rejected switch after adding network.'));
                            }),
                            promise,
                        ]);
                        return chain;
                    }
                    catch (error) {
                        throw new UserRejectedRequestError(error);
                    }
                }
                if (error.code === UserRejectedRequestError.code)
                    throw new UserRejectedRequestError(error);
                throw new SwitchChainError(error);
            }
        },
        async onAccountsChanged(accounts) {
            // Disconnect if there are no accounts
            if (accounts.length === 0)
                this.onDisconnect();
            // Connect if emitter is listening for connect event (e.g. is disconnected and connects through wallet interface)
            else if (config.emitter.listenerCount('connect')) {
                const chainId = (await this.getChainId()).toString();
                this.onConnect({ chainId });
                // Remove disconnected shim if it exists
                if (shimDisconnect)
                    await config.storage?.removeItem(`${this.id}.disconnected`);
            }
            // Regular change event
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onConnect(connectInfo) {
            const accounts = await this.getAccounts();
            if (accounts.length === 0)
                return;
            const chainId = Number(connectInfo.chainId);
            config.emitter.emit('connect', { accounts, chainId });
            // Manage EIP-1193 event listeners
            const provider = await this.getProvider();
            if (provider) {
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
            }
        },
        async onDisconnect(error) {
            const provider = await this.getProvider();
            // If MetaMask emits a `code: 1013` error, wait for reconnection before disconnecting
            // https://github.com/MetaMask/providers/pull/120
            if (error && error.code === 1013) {
                if (provider && !!(await this.getAccounts()).length)
                    return;
            }
            // No need to remove `${this.id}.disconnected` from storage because `onDisconnect` is typically
            // only called when the wallet is disconnected through the wallet's interface, meaning the wallet
            // actually disconnected and we don't need to simulate it.
            config.emitter.emit('disconnect');
            // Manage EIP-1193 event listeners
            if (provider) {
                if (chainChanged) {
                    provider.removeListener('chainChanged', chainChanged);
                    chainChanged = undefined;
                }
                if (disconnect) {
                    provider.removeListener('disconnect', disconnect);
                    disconnect = undefined;
                }
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider.on('connect', connect);
                }
            }
        },
    }));
}
const targetMap = {
    coinbaseWallet: {
        id: 'coinbaseWallet',
        name: 'Coinbase Wallet',
        provider(window) {
            if (window?.coinbaseWalletExtension)
                return window.coinbaseWalletExtension;
            return findProvider(window, 'isCoinbaseWallet');
        },
    },
    metaMask: {
        id: 'metaMask',
        name: 'MetaMask',
        provider(window) {
            return findProvider(window, (provider) => {
                if (!provider.isMetaMask)
                    return false;
                // Brave tries to make itself look like MetaMask
                // Could also try RPC `web3_clientVersion` if following is unreliable
                if (provider.isBraveWallet && !provider._events && !provider._state)
                    return false;
                // Other wallets that try to look like MetaMask
                const flags = [
                    'isApexWallet',
                    'isAvalanche',
                    'isBitKeep',
                    'isBlockWallet',
                    'isKuCoinWallet',
                    'isMathWallet',
                    'isOkxWallet',
                    'isOKExWallet',
                    'isOneInchIOSWallet',
                    'isOneInchAndroidWallet',
                    'isOpera',
                    'isPhantom',
                    'isPortal',
                    'isRabby',
                    'isTokenPocket',
                    'isTokenary',
                    'isUniswapWallet',
                    'isZerion',
                ];
                for (const flag of flags)
                    if (provider[flag])
                        return false;
                return true;
            });
        },
    },
    phantom: {
        id: 'phantom',
        name: 'Phantom',
        provider(window) {
            if (window?.phantom?.ethereum)
                return window.phantom?.ethereum;
            return findProvider(window, 'isPhantom');
        },
    },
};
function findProvider(window, select) {
    function isProvider(provider) {
        if (typeof select === 'function')
            return select(provider);
        if (typeof select === 'string')
            return provider[select];
        return true;
    }
    const ethereum = window.ethereum;
    if (ethereum?.providers)
        return ethereum.providers.find((provider) => isProvider(provider));
    if (ethereum && isProvider(ethereum))
        return ethereum;
    return undefined;
}

/**
 * Announces an EIP-1193 Provider.
 */
/**
 * Watches for EIP-1193 Providers to be announced.
 */
function requestProviders(listener) {
    if (typeof window === 'undefined')
        return;
    const handler = (event) => listener(event.detail);
    window.addEventListener('eip6963:announceProvider', handler);
    window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));
    return () => window.removeEventListener('eip6963:announceProvider', handler);
}

function createStore$1() {
    const listeners = new Set();
    let providerDetails = [];
    const request = () => requestProviders((providerDetail) => {
        if (providerDetails.some(({ info }) => info.uuid === providerDetail.info.uuid))
            return;
        providerDetails = [...providerDetails, providerDetail];
        listeners.forEach((listener) => listener(providerDetails, { added: [providerDetail] }));
    });
    let unwatch = request();
    return {
        _listeners() {
            return listeners;
        },
        clear() {
            listeners.forEach((listener) => listener([], { removed: [...providerDetails] }));
            providerDetails = [];
        },
        destroy() {
            this.clear();
            listeners.clear();
            unwatch?.();
        },
        findProvider({ rdns }) {
            return providerDetails.find((providerDetail) => providerDetail.info.rdns === rdns);
        },
        getProviders() {
            return providerDetails;
        },
        reset() {
            this.clear();
            unwatch?.();
            unwatch = request();
        },
        subscribe(listener, { emitImmediately } = {}) {
            listeners.add(listener);
            if (emitImmediately)
                listener(providerDetails, { added: providerDetails });
            return () => listeners.delete(listener);
        },
    };
}

const subscribeWithSelectorImpl = (fn) => (set, get, api) => {
  const origSubscribe = api.subscribe;
  api.subscribe = (selector, optListener, options) => {
    let listener = selector;
    if (optListener) {
      const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
      let currentSlice = selector(api.getState());
      listener = (state) => {
        const nextSlice = selector(state);
        if (!equalityFn(currentSlice, nextSlice)) {
          const previousSlice = currentSlice;
          optListener(currentSlice = nextSlice, previousSlice);
        }
      };
      if (options == null ? void 0 : options.fireImmediately) {
        optListener(currentSlice, currentSlice);
      }
    }
    return origSubscribe(listener);
  };
  const initialState = fn(set, get, api);
  return initialState;
};
const subscribeWithSelector = subscribeWithSelectorImpl;

function createJSONStorage(getStorage, options) {
  let storage;
  try {
    storage = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name) => {
      var _a;
      const parse = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0 );
      };
      const str = (_a = storage.getItem(name)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse);
      }
      return parse(str);
    },
    setItem: (name, newValue) => storage.setItem(
      name,
      JSON.stringify(newValue, void 0 )
    ),
    removeItem: (name) => storage.removeItem(name)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
    return {
      then(onFulfilled) {
        return toThenable(onFulfilled)(result);
      },
      catch(_onRejected) {
        return this;
      }
    };
  } catch (e) {
    return {
      then(_onFulfilled) {
        return this;
      },
      catch(onRejected) {
        return toThenable(onRejected)(e);
      }
    };
  }
};
const persistImpl = (config, baseOptions) => (set, get, api) => {
  let options = {
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => state,
    version: 0,
    merge: (persistedState, currentState) => ({
      ...currentState,
      ...persistedState
    }),
    ...baseOptions
  };
  let hasHydrated = false;
  const hydrationListeners = /* @__PURE__ */ new Set();
  const finishHydrationListeners = /* @__PURE__ */ new Set();
  let storage = options.storage;
  if (!storage) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    void setItem();
  };
  const configResult = config(
    (...args) => {
      set(...args);
      void setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage) return;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            return [
              true,
              options.migrate(
                deserializedStorageValue.state,
                deserializedStorageValue.version
              )
            ];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(stateFromStorage, void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage == null ? void 0 : storage.removeItem(options.name);
    },
    getOptions: () => options,
    rehydrate: () => hydrate(),
    hasHydrated: () => hasHydrated,
    onHydrate: (cb) => {
      hydrationListeners.add(cb);
      return () => {
        hydrationListeners.delete(cb);
      };
    },
    onFinishHydration: (cb) => {
      finishHydrationListeners.add(cb);
      return () => {
        finishHydrationListeners.delete(cb);
      };
    }
  };
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

var eventemitter3 = {exports: {}};

var hasRequiredEventemitter3;

function requireEventemitter3 () {
	if (hasRequiredEventemitter3) return eventemitter3.exports;
	hasRequiredEventemitter3 = 1;
	(function (module) {

		var has = Object.prototype.hasOwnProperty
		  , prefix = '~';

		/**
		 * Constructor to create a storage for our `EE` objects.
		 * An `Events` instance is a plain object whose properties are event names.
		 *
		 * @constructor
		 * @private
		 */
		function Events() {}

		//
		// We try to not inherit from `Object.prototype`. In some engines creating an
		// instance in this way is faster than calling `Object.create(null)` directly.
		// If `Object.create(null)` is not supported we prefix the event names with a
		// character to make sure that the built-in object properties are not
		// overridden or used as an attack vector.
		//
		if (Object.create) {
		  Events.prototype = Object.create(null);

		  //
		  // This hack is needed because the `__proto__` property is still inherited in
		  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
		  //
		  if (!new Events().__proto__) prefix = false;
		}

		/**
		 * Representation of a single event listener.
		 *
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
		 * @constructor
		 * @private
		 */
		function EE(fn, context, once) {
		  this.fn = fn;
		  this.context = context;
		  this.once = once || false;
		}

		/**
		 * Add a listener for a given event.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} once Specify if the listener is a one-time listener.
		 * @returns {EventEmitter}
		 * @private
		 */
		function addListener(emitter, event, fn, context, once) {
		  if (typeof fn !== 'function') {
		    throw new TypeError('The listener must be a function');
		  }

		  var listener = new EE(fn, context || emitter, once)
		    , evt = prefix ? prefix + event : event;

		  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		  else emitter._events[evt] = [emitter._events[evt], listener];

		  return emitter;
		}

		/**
		 * Clear event by name.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} evt The Event name.
		 * @private
		 */
		function clearEvent(emitter, evt) {
		  if (--emitter._eventsCount === 0) emitter._events = new Events();
		  else delete emitter._events[evt];
		}

		/**
		 * Minimal `EventEmitter` interface that is molded against the Node.js
		 * `EventEmitter` interface.
		 *
		 * @constructor
		 * @public
		 */
		function EventEmitter() {
		  this._events = new Events();
		  this._eventsCount = 0;
		}

		/**
		 * Return an array listing the events for which the emitter has registered
		 * listeners.
		 *
		 * @returns {Array}
		 * @public
		 */
		EventEmitter.prototype.eventNames = function eventNames() {
		  var names = []
		    , events
		    , name;

		  if (this._eventsCount === 0) return names;

		  for (name in (events = this._events)) {
		    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		  }

		  if (Object.getOwnPropertySymbols) {
		    return names.concat(Object.getOwnPropertySymbols(events));
		  }

		  return names;
		};

		/**
		 * Return the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Array} The registered listeners.
		 * @public
		 */
		EventEmitter.prototype.listeners = function listeners(event) {
		  var evt = prefix ? prefix + event : event
		    , handlers = this._events[evt];

		  if (!handlers) return [];
		  if (handlers.fn) return [handlers.fn];

		  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
		    ee[i] = handlers[i].fn;
		  }

		  return ee;
		};

		/**
		 * Return the number of listeners listening to a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Number} The number of listeners.
		 * @public
		 */
		EventEmitter.prototype.listenerCount = function listenerCount(event) {
		  var evt = prefix ? prefix + event : event
		    , listeners = this._events[evt];

		  if (!listeners) return 0;
		  if (listeners.fn) return 1;
		  return listeners.length;
		};

		/**
		 * Calls each of the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Boolean} `true` if the event had listeners, else `false`.
		 * @public
		 */
		EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return false;

		  var listeners = this._events[evt]
		    , len = arguments.length
		    , args
		    , i;

		  if (listeners.fn) {
		    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

		    switch (len) {
		      case 1: return listeners.fn.call(listeners.context), true;
		      case 2: return listeners.fn.call(listeners.context, a1), true;
		      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
		      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
		      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
		      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		    }

		    for (i = 1, args = new Array(len -1); i < len; i++) {
		      args[i - 1] = arguments[i];
		    }

		    listeners.fn.apply(listeners.context, args);
		  } else {
		    var length = listeners.length
		      , j;

		    for (i = 0; i < length; i++) {
		      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

		      switch (len) {
		        case 1: listeners[i].fn.call(listeners[i].context); break;
		        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
		        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
		        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
		        default:
		          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
		            args[j - 1] = arguments[j];
		          }

		          listeners[i].fn.apply(listeners[i].context, args);
		      }
		    }
		  }

		  return true;
		};

		/**
		 * Add a listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.on = function on(event, fn, context) {
		  return addListener(this, event, fn, context, false);
		};

		/**
		 * Add a one-time listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.once = function once(event, fn, context) {
		  return addListener(this, event, fn, context, true);
		};

		/**
		 * Remove the listeners of a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn Only remove the listeners that match this function.
		 * @param {*} context Only remove the listeners that have this context.
		 * @param {Boolean} once Only remove one-time listeners.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return this;
		  if (!fn) {
		    clearEvent(this, evt);
		    return this;
		  }

		  var listeners = this._events[evt];

		  if (listeners.fn) {
		    if (
		      listeners.fn === fn &&
		      (!once || listeners.once) &&
		      (!context || listeners.context === context)
		    ) {
		      clearEvent(this, evt);
		    }
		  } else {
		    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
		      if (
		        listeners[i].fn !== fn ||
		        (once && !listeners[i].once) ||
		        (context && listeners[i].context !== context)
		      ) {
		        events.push(listeners[i]);
		      }
		    }

		    //
		    // Reset the array, or remove it completely if we have no more listeners.
		    //
		    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
		    else clearEvent(this, evt);
		  }

		  return this;
		};

		/**
		 * Remove all listeners, or those of the specified event.
		 *
		 * @param {(String|Symbol)} [event] The event name.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		  var evt;

		  if (event) {
		    evt = prefix ? prefix + event : event;
		    if (this._events[evt]) clearEvent(this, evt);
		  } else {
		    this._events = new Events();
		    this._eventsCount = 0;
		  }

		  return this;
		};

		//
		// Alias methods names because people roll like that.
		//
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.addListener = EventEmitter.prototype.on;

		//
		// Expose the prefix.
		//
		EventEmitter.prefixed = prefix;

		//
		// Allow `EventEmitter` to be imported as module namespace.
		//
		EventEmitter.EventEmitter = EventEmitter;

		//
		// Expose the module.
		//
		{
		  module.exports = EventEmitter;
		} 
	} (eventemitter3));
	return eventemitter3.exports;
}

var eventemitter3Exports = requireEventemitter3();
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

class Emitter {
    constructor(uid) {
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: uid
        });
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventEmitter()
        });
    }
    on(eventName, fn) {
        this._emitter.on(eventName, fn);
    }
    once(eventName, fn) {
        this._emitter.once(eventName, fn);
    }
    off(eventName, fn) {
        this._emitter.off(eventName, fn);
    }
    emit(eventName, ...params) {
        const data = params[0];
        this._emitter.emit(eventName, { uid: this.uid, ...data });
    }
    listenerCount(eventName) {
        return this._emitter.listenerCount(eventName);
    }
}
function createEmitter(uid) {
    return new Emitter(uid);
}

function deserialize(value, reviver) {
    return JSON.parse(value, (key, value_) => {
        let value = value_;
        if (value?.__type === 'bigint')
            value = BigInt(value.value);
        if (value?.__type === 'Map')
            value = new Map(value.value);
        return reviver?.(key, value) ?? value;
    });
}

/**
 * Get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys, cutoff) {
    return keys.slice(0, cutoff).join('.') || '.';
}
/**
 * Faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */
function getCutoff(array, value) {
    const { length } = array;
    for (let index = 0; index < length; ++index) {
        if (array[index] === value) {
            return index + 1;
        }
    }
    return 0;
}
/**
 * Create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(replacer, circularReplacer) {
    const hasReplacer = typeof replacer === 'function';
    const hasCircularReplacer = typeof circularReplacer === 'function';
    const cache = [];
    const keys = [];
    return function replace(key, value) {
        if (typeof value === 'object') {
            if (cache.length) {
                const thisCutoff = getCutoff(cache, this);
                if (thisCutoff === 0) {
                    cache[cache.length] = this;
                }
                else {
                    cache.splice(thisCutoff);
                    keys.splice(thisCutoff);
                }
                keys[keys.length] = key;
                const valueCutoff = getCutoff(cache, value);
                if (valueCutoff !== 0) {
                    return hasCircularReplacer
                        ? circularReplacer.call(this, key, value, getReferenceKey(keys, valueCutoff))
                        : `[ref=${getReferenceKey(keys, valueCutoff)}]`;
                }
            }
            else {
                cache[0] = value;
                keys[0] = key;
            }
        }
        return hasReplacer ? replacer.call(this, key, value) : value;
    };
}
/**
 * Stringifier that handles circular values
 *
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */
function serialize(value, replacer, indent, circularReplacer) {
    return JSON.stringify(value, createReplacer((key, value_) => {
        let value = value_;
        if (typeof value === 'bigint')
            value = { __type: 'bigint', value: value_.toString() };
        if (value instanceof Map)
            value = { __type: 'Map', value: Array.from(value_.entries()) };
        return replacer?.(key, value) ?? value;
    }, circularReplacer), indent ?? undefined);
}

function createStorage(parameters) {
    const { deserialize: deserialize$1 = deserialize, key: prefix = 'wagmi', serialize: serialize$1 = serialize, storage = noopStorage, } = parameters;
    function unwrap(value) {
        if (value instanceof Promise)
            return value.then((x) => x).catch(() => null);
        return value;
    }
    return {
        ...storage,
        key: prefix,
        async getItem(key, defaultValue) {
            const value = storage.getItem(`${prefix}.${key}`);
            const unwrapped = await unwrap(value);
            if (unwrapped)
                return deserialize$1(unwrapped) ?? null;
            return (defaultValue ?? null);
        },
        async setItem(key, value) {
            const storageKey = `${prefix}.${key}`;
            if (value === null)
                await unwrap(storage.removeItem(storageKey));
            else
                await unwrap(storage.setItem(storageKey, serialize$1(value)));
        },
        async removeItem(key) {
            await unwrap(storage.removeItem(`${prefix}.${key}`));
        },
    };
}
const noopStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};
function getDefaultStorage() {
    const storage = (() => {
        // biome-ignore lint/complexity/useOptionalChain: _
        if (typeof window !== 'undefined' && window.localStorage)
            return window.localStorage;
        return noopStorage;
    })();
    return {
        getItem(key) {
            return storage.getItem(key);
        },
        removeItem(key) {
            storage.removeItem(key);
        },
        setItem(key, value) {
            try {
                storage.setItem(key, value);
                // silence errors by default (QuotaExceededError, SecurityError, etc.)
            }
            catch { }
        },
    };
}

const size = 256;
let index = size;
let buffer;
function uid(length = 11) {
    if (!buffer || index + length > size * 2) {
        buffer = '';
        index = 0;
        for (let i = 0; i < size; i++) {
            buffer += ((256 + Math.random() * 256) | 0).toString(16).substring(1);
        }
    }
    return buffer.substring(index, index++ + length);
}

function createConfig(parameters) {
    const { multiInjectedProviderDiscovery = true, storage = createStorage({
        storage: getDefaultStorage(),
    }), syncConnectedChain = true, ssr = false, ...rest } = parameters;
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Set up connectors, clients, etc.
    /////////////////////////////////////////////////////////////////////////////////////////////////
    const mipd = typeof window !== 'undefined' && multiInjectedProviderDiscovery
        ? createStore$1()
        : undefined;
    const chains = createStore(() => rest.chains);
    const connectors = createStore(() => {
        const collection = [];
        const rdnsSet = new Set();
        for (const connectorFns of rest.connectors ?? []) {
            const connector = setup(connectorFns);
            collection.push(connector);
            if (!ssr && connector.rdns) {
                const rdnsValues = typeof connector.rdns === 'string' ? [connector.rdns] : connector.rdns;
                for (const rdns of rdnsValues) {
                    rdnsSet.add(rdns);
                }
            }
        }
        if (!ssr && mipd) {
            const providers = mipd.getProviders();
            for (const provider of providers) {
                if (rdnsSet.has(provider.info.rdns))
                    continue;
                collection.push(setup(providerDetailToConnector(provider)));
            }
        }
        return collection;
    });
    function setup(connectorFn) {
        // Set up emitter with uid and add to connector so they are "linked" together.
        const emitter = createEmitter(uid());
        let rdns;
        const connector = {
            ...connectorFn({
                emitter,
                chains: chains.getState(),
                get providers() {
                    if (!mipd || !rdns)
                        return [];
                    const rdnsValues = typeof rdns === 'string' ? [rdns] : rdns;
                    const providers = mipd.getProviders();
                    return rdnsValues.flatMap((rdns) => providers.filter((provider) => provider.info.rdns === rdns));
                },
                storage,
                transports: rest.transports,
            }),
            emitter,
            uid: emitter.uid,
        };
        rdns = connector.rdns;
        // Start listening for `connect` events on connector setup
        // This allows connectors to "connect" themselves without user interaction (e.g. MetaMask's "Manually connect to current site")
        emitter.on('connect', connect);
        connector.setup?.();
        return connector;
    }
    function providerDetailToConnector(providerDetail) {
        const { info } = providerDetail;
        const provider = providerDetail.provider;
        return injected({ target: { ...info, id: info.rdns, provider } });
    }
    const clients = new Map();
    function getClient(config = {}) {
        const chainId = config.chainId ?? store.getState().chainId;
        const chain = chains.getState().find((x) => x.id === chainId);
        // chainId specified and not configured
        if (config.chainId && !chain)
            throw new ChainNotConfiguredError();
        {
            const client = clients.get(store.getState().chainId);
            if (client && !chain)
                return client;
            if (!chain)
                throw new ChainNotConfiguredError();
        }
        // If a memoized client exists for a chain id, use that.
        {
            const client = clients.get(chainId);
            if (client)
                return client;
        }
        let client;
        if (rest.client)
            client = rest.client({ chain });
        else {
            const chainId = chain.id;
            const chainIds = chains.getState().map((x) => x.id);
            // Grab all properties off `rest` and resolve for use in `createClient`
            const properties = {};
            const entries = Object.entries(rest);
            for (const [key, value] of entries) {
                if (key === 'chains' ||
                    key === 'client' ||
                    key === 'connectors' ||
                    key === 'transports')
                    continue;
                if (typeof value === 'object') {
                    // check if value is chainId-specific since some values can be objects
                    // e.g. { batch: { multicall: { batchSize: 1024 } } }
                    if (chainId in value)
                        properties[key] = value[chainId];
                    else {
                        // check if value is chainId-specific, but does not have value for current chainId
                        const hasChainSpecificValue = chainIds.some((x) => x in value);
                        if (hasChainSpecificValue)
                            continue;
                        properties[key] = value;
                    }
                }
                else
                    properties[key] = value;
            }
            client = createClient({
                ...properties,
                chain,
                batch: properties.batch ?? { multicall: true },
                transport: (parameters) => rest.transports[chainId]({ ...parameters, connectors }),
            });
        }
        clients.set(chainId, client);
        return client;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Create store
    /////////////////////////////////////////////////////////////////////////////////////////////////
    function getInitialState() {
        return {
            chainId: chains.getState()[0].id,
            connections: new Map(),
            current: null,
            status: 'disconnected',
        };
    }
    let currentVersion;
    const prefix = '0.0.0-canary-';
    if (version.startsWith(prefix))
        currentVersion = Number.parseInt(version.replace(prefix, ''), 10);
    // use package major version to version store
    else
        currentVersion = Number.parseInt(version.split('.')[0] ?? '0', 10);
    const store = createStore(subscribeWithSelector(
    // only use persist middleware if storage exists
    storage
        ? persist(getInitialState, {
            migrate(persistedState, version) {
                if (version === currentVersion)
                    return persistedState;
                const initialState = getInitialState();
                const chainId = validatePersistedChainId(persistedState, initialState.chainId);
                return { ...initialState, chainId };
            },
            name: 'store',
            partialize(state) {
                // Only persist "critical" store properties to preserve storage size.
                return {
                    connections: {
                        __type: 'Map',
                        value: Array.from(state.connections.entries()).map(([key, connection]) => {
                            const { id, name, type, uid } = connection.connector;
                            const connector = { id, name, type, uid };
                            return [key, { ...connection, connector }];
                        }),
                    },
                    chainId: state.chainId,
                    current: state.current,
                };
            },
            merge(persistedState, currentState) {
                // `status` should not be persisted as it messes with reconnection
                if (typeof persistedState === 'object' &&
                    persistedState &&
                    'status' in persistedState)
                    delete persistedState.status;
                // Make sure persisted `chainId` is valid
                const chainId = validatePersistedChainId(persistedState, currentState.chainId);
                return {
                    ...currentState,
                    ...persistedState,
                    chainId,
                };
            },
            skipHydration: ssr,
            storage: storage,
            version: currentVersion,
        })
        : getInitialState));
    store.setState(getInitialState());
    function validatePersistedChainId(persistedState, defaultChainId) {
        return persistedState &&
            typeof persistedState === 'object' &&
            'chainId' in persistedState &&
            typeof persistedState.chainId === 'number' &&
            chains.getState().some((x) => x.id === persistedState.chainId)
            ? persistedState.chainId
            : defaultChainId;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Subscribe to changes
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Update default chain when connector chain changes
    if (syncConnectedChain)
        store.subscribe(({ connections, current }) => current ? connections.get(current)?.chainId : undefined, (chainId) => {
            // If chain is not configured, then don't switch over to it.
            const isChainConfigured = chains
                .getState()
                .some((x) => x.id === chainId);
            if (!isChainConfigured)
                return;
            return store.setState((x) => ({
                ...x,
                chainId: chainId ?? x.chainId,
            }));
        });
    // EIP-6963 subscribe for new wallet providers
    mipd?.subscribe((providerDetails) => {
        const connectorIdSet = new Set();
        const connectorRdnsSet = new Set();
        for (const connector of connectors.getState()) {
            connectorIdSet.add(connector.id);
            if (connector.rdns) {
                const rdnsValues = typeof connector.rdns === 'string' ? [connector.rdns] : connector.rdns;
                for (const rdns of rdnsValues) {
                    connectorRdnsSet.add(rdns);
                }
            }
        }
        const newConnectors = [];
        for (const providerDetail of providerDetails) {
            if (connectorRdnsSet.has(providerDetail.info.rdns))
                continue;
            const connector = setup(providerDetailToConnector(providerDetail));
            if (connectorIdSet.has(connector.id))
                continue;
            newConnectors.push(connector);
        }
        if (storage && !store.persist.hasHydrated())
            return;
        connectors.setState((x) => [...x, ...newConnectors], true);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Emitter listeners
    /////////////////////////////////////////////////////////////////////////////////////////////////
    function change(data) {
        store.setState((x) => {
            const connection = x.connections.get(data.uid);
            if (!connection)
                return x;
            return {
                ...x,
                connections: new Map(x.connections).set(data.uid, {
                    accounts: data.accounts ??
                        connection.accounts,
                    chainId: data.chainId ?? connection.chainId,
                    connector: connection.connector,
                }),
            };
        });
    }
    function connect(data) {
        // Disable handling if reconnecting/connecting
        if (store.getState().status === 'connecting' ||
            store.getState().status === 'reconnecting')
            return;
        store.setState((x) => {
            const connector = connectors.getState().find((x) => x.uid === data.uid);
            if (!connector)
                return x;
            if (connector.emitter.listenerCount('connect'))
                connector.emitter.off('connect', change);
            if (!connector.emitter.listenerCount('change'))
                connector.emitter.on('change', change);
            if (!connector.emitter.listenerCount('disconnect'))
                connector.emitter.on('disconnect', disconnect);
            return {
                ...x,
                connections: new Map(x.connections).set(data.uid, {
                    accounts: data.accounts,
                    chainId: data.chainId,
                    connector: connector,
                }),
                current: data.uid,
                status: 'connected',
            };
        });
    }
    function disconnect(data) {
        store.setState((x) => {
            const connection = x.connections.get(data.uid);
            if (connection) {
                const connector = connection.connector;
                if (connector.emitter.listenerCount('change'))
                    connection.connector.emitter.off('change', change);
                if (connector.emitter.listenerCount('disconnect'))
                    connection.connector.emitter.off('disconnect', disconnect);
                if (!connector.emitter.listenerCount('connect'))
                    connection.connector.emitter.on('connect', connect);
            }
            x.connections.delete(data.uid);
            if (x.connections.size === 0)
                return {
                    ...x,
                    connections: new Map(),
                    current: null,
                    status: 'disconnected',
                };
            const nextConnection = x.connections.values().next().value;
            return {
                ...x,
                connections: new Map(x.connections),
                current: nextConnection.connector.uid,
            };
        });
    }
    return {
        get chains() {
            return chains.getState();
        },
        get connectors() {
            return connectors.getState();
        },
        storage,
        getClient,
        get state() {
            return store.getState();
        },
        setState(value) {
            let newState;
            if (typeof value === 'function')
                newState = value(store.getState());
            else
                newState = value;
            // Reset state if it got set to something not matching the base state
            const initialState = getInitialState();
            if (typeof newState !== 'object')
                newState = initialState;
            const isCorrupt = Object.keys(initialState).some((x) => !(x in newState));
            if (isCorrupt)
                newState = initialState;
            store.setState(newState, true);
        },
        subscribe(selector, listener, options) {
            return store.subscribe(selector, listener, options
                ? {
                    ...options,
                    fireImmediately: options.emitImmediately,
                    // Workaround cast since Zustand does not support `'exactOptionalPropertyTypes'`
                }
                : undefined);
        },
        _internal: {
            mipd,
            async revalidate() {
                // Check connections to see if they are still active
                const state = store.getState();
                const connections = state.connections;
                let current = state.current;
                for (const [, connection] of connections) {
                    const connector = connection.connector;
                    // check if `connect.isAuthorized` exists
                    // partial connectors in storage do not have it
                    const isAuthorized = connector.isAuthorized
                        ? await connector.isAuthorized()
                        : false;
                    if (isAuthorized)
                        continue;
                    // Remove stale connection
                    connections.delete(connector.uid);
                    if (current === connector.uid)
                        current = null;
                }
                // set connections
                store.setState((x) => ({ ...x, connections, current }));
            },
            store,
            ssr: Boolean(ssr),
            syncConnectedChain,
            transports: rest.transports,
            chains: {
                setState(value) {
                    const nextChains = (typeof value === 'function' ? value(chains.getState()) : value);
                    if (nextChains.length === 0)
                        return;
                    return chains.setState(nextChains, true);
                },
                subscribe(listener) {
                    return chains.subscribe(listener);
                },
            },
            connectors: {
                providerDetailToConnector,
                setup: setup,
                setState(value) {
                    return connectors.setState(typeof value === 'function' ? value(connectors.getState()) : value, true);
                },
                subscribe(listener) {
                    return connectors.subscribe(listener);
                },
            },
            events: { change, connect, disconnect },
        },
    };
}

function extractRpcUrls(parameters) {
    const { chain } = parameters;
    const fallbackUrl = chain.rpcUrls.default.http[0];
    if (!parameters.transports)
        return [fallbackUrl];
    const transport = parameters.transports?.[chain.id]?.({ chain });
    const transports = transport?.value?.transports || [transport];
    return transports.map(({ value }) => value?.url || fallbackUrl);
}

coinbaseWallet.type = 'coinbaseWallet';
function coinbaseWallet(parameters = {}) {
    let walletProvider;
    let accountsChanged;
    let chainChanged;
    let disconnect;
    return createConnector((config) => ({
        id: 'coinbaseWalletSDK',
        name: 'Coinbase Wallet',
        rdns: 'com.coinbase.wallet',
        type: coinbaseWallet.type,
        async connect({ chainId, withCapabilities, ...rest } = {}) {
            try {
                const provider = await this.getProvider();
                const accounts = (await provider.request({
                    method: 'eth_requestAccounts',
                    params: 'instantOnboarding' in rest && rest.instantOnboarding
                        ? [{ onboarding: 'instant' }]
                        : [],
                })).map((x) => getAddress(x));
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code)
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (error) {
                if (/(user closed modal|accounts received is empty|user denied account|request rejected)/i.test(error.message))
                    throw new UserRejectedRequestError(error);
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            provider.disconnect();
            provider.close?.();
        },
        async getAccounts() {
            const provider = await this.getProvider();
            return (await provider.request({
                method: 'eth_accounts',
            })).map((x) => getAddress(x));
        },
        async getChainId() {
            const provider = await this.getProvider();
            const chainId = (await provider.request({
                method: 'eth_chainId',
            }));
            return Number(chainId);
        },
        async getProvider() {
            if (!walletProvider) {
                const { createCoinbaseWalletSDK } = await (() => {
                    // safe webpack optional peer dependency dynamic import
                    try {
                        return import('./index-Dj11zECG.js').then(function (n) { return n.i; });
                    }
                    catch {
                        throw new Error('dependency "@coinbase/wallet-sdk" not found');
                    }
                })();
                const sdk = createCoinbaseWalletSDK({
                    ...parameters,
                    appChainIds: config.chains.map((x) => x.id),
                    preference: {
                        options: 'all',
                        ...(parameters.preference ?? {}),
                    },
                });
                walletProvider = sdk.getProvider();
            }
            return walletProvider;
        },
        async isAuthorized() {
            try {
                const accounts = await this.getAccounts();
                return !!accounts.length;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const chain = config.chains.find((chain) => chain.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            const provider = await this.getProvider();
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: numberToHex(chain.id) }],
                });
                return chain;
            }
            catch (error) {
                // Indicates chain is not added to provider
                if (error.code === 4902) {
                    try {
                        let blockExplorerUrls;
                        if (addEthereumChainParameter?.blockExplorerUrls)
                            blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                        else
                            blockExplorerUrls = chain.blockExplorers?.default.url
                                ? [chain.blockExplorers?.default.url]
                                : [];
                        let rpcUrls;
                        if (addEthereumChainParameter?.rpcUrls?.length)
                            rpcUrls = addEthereumChainParameter.rpcUrls;
                        else
                            rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];
                        const addEthereumChain = {
                            blockExplorerUrls,
                            chainId: numberToHex(chainId),
                            chainName: addEthereumChainParameter?.chainName ?? chain.name,
                            iconUrls: addEthereumChainParameter?.iconUrls,
                            nativeCurrency: addEthereumChainParameter?.nativeCurrency ??
                                chain.nativeCurrency,
                            rpcUrls,
                        };
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [addEthereumChain],
                        });
                        return chain;
                    }
                    catch (error) {
                        throw new UserRejectedRequestError(error);
                    }
                }
                throw new SwitchChainError(error);
            }
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0)
                this.onDisconnect();
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onDisconnect(_error) {
            config.emitter.emit('disconnect');
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
        },
    }));
}

walletConnect.type = 'walletConnect';
function walletConnect(parameters) {
    const isNewChainsStale = parameters.isNewChainsStale ?? true;
    let provider_;
    let providerPromise;
    const NAMESPACE = 'eip155';
    let accountsChanged;
    let chainChanged;
    let connect;
    let displayUri;
    let sessionDelete;
    let disconnect;
    return createConnector((config) => ({
        id: 'walletConnect',
        name: 'WalletConnect',
        type: walletConnect.type,
        async setup() {
            const provider = await this.getProvider().catch(() => null);
            if (!provider)
                return;
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
            if (!sessionDelete) {
                sessionDelete = this.onSessionDelete.bind(this);
                provider.on('session_delete', sessionDelete);
            }
        },
        async connect({ chainId, withCapabilities, ...rest } = {}) {
            try {
                const provider = await this.getProvider();
                if (!provider)
                    throw new ProviderNotFoundError();
                if (!displayUri) {
                    displayUri = this.onDisplayUri;
                    provider.on('display_uri', displayUri);
                }
                let targetChainId = chainId;
                if (!targetChainId) {
                    const state = (await config.storage?.getItem('state')) ?? {};
                    const isChainSupported = config.chains.some((x) => x.id === state.chainId);
                    if (isChainSupported)
                        targetChainId = state.chainId;
                    else
                        targetChainId = config.chains[0]?.id;
                }
                if (!targetChainId)
                    throw new Error('No chains found on connector.');
                const isChainsStale = await this.isChainsStale();
                // If there is an active session with stale chains, disconnect current session.
                if (provider.session && isChainsStale)
                    await provider.disconnect();
                // If there isn't an active session or chains are stale, connect.
                if (!provider.session || isChainsStale) {
                    const optionalChains = config.chains
                        .filter((chain) => chain.id !== targetChainId)
                        .map((optionalChain) => optionalChain.id);
                    await provider.connect({
                        optionalChains: [targetChainId, ...optionalChains],
                        ...('pairingTopic' in rest
                            ? { pairingTopic: rest.pairingTopic }
                            : {}),
                    });
                    this.setRequestedChainsIds(config.chains.map((x) => x.id));
                }
                // If session exists and chains are authorized, enable provider for required chain
                const accounts = (await provider.enable()).map((x) => getAddress(x));
                // Switch to chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain({ chainId }).catch((error) => {
                        if (error.code === UserRejectedRequestError.code &&
                            error.cause?.message !==
                                'Missing or invalid. request() method: wallet_addEthereumChain')
                            throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }
                if (displayUri) {
                    provider.removeListener('display_uri', displayUri);
                    displayUri = undefined;
                }
                if (connect) {
                    provider.removeListener('connect', connect);
                    connect = undefined;
                }
                if (!accountsChanged) {
                    accountsChanged = this.onAccountsChanged.bind(this);
                    provider.on('accountsChanged', accountsChanged);
                }
                if (!chainChanged) {
                    chainChanged = this.onChainChanged.bind(this);
                    provider.on('chainChanged', chainChanged);
                }
                if (!disconnect) {
                    disconnect = this.onDisconnect.bind(this);
                    provider.on('disconnect', disconnect);
                }
                if (!sessionDelete) {
                    sessionDelete = this.onSessionDelete.bind(this);
                    provider.on('session_delete', sessionDelete);
                }
                return {
                    accounts: (withCapabilities
                        ? accounts.map((address) => ({ address, capabilities: {} }))
                        : accounts),
                    chainId: currentChainId,
                };
            }
            catch (error) {
                if (/(user rejected|connection request reset)/i.test(error?.message)) {
                    throw new UserRejectedRequestError(error);
                }
                throw error;
            }
        },
        async disconnect() {
            const provider = await this.getProvider();
            try {
                await provider?.disconnect();
            }
            catch (error) {
                if (!/No matching key/i.test(error.message))
                    throw error;
            }
            finally {
                if (chainChanged) {
                    provider?.removeListener('chainChanged', chainChanged);
                    chainChanged = undefined;
                }
                if (disconnect) {
                    provider?.removeListener('disconnect', disconnect);
                    disconnect = undefined;
                }
                if (!connect) {
                    connect = this.onConnect.bind(this);
                    provider?.on('connect', connect);
                }
                if (accountsChanged) {
                    provider?.removeListener('accountsChanged', accountsChanged);
                    accountsChanged = undefined;
                }
                if (sessionDelete) {
                    provider?.removeListener('session_delete', sessionDelete);
                    sessionDelete = undefined;
                }
                this.setRequestedChainsIds([]);
            }
        },
        async getAccounts() {
            const provider = await this.getProvider();
            return provider.accounts.map((x) => getAddress(x));
        },
        async getProvider({ chainId } = {}) {
            async function initProvider() {
                const optionalChains = config.chains.map((x) => x.id);
                if (!optionalChains.length)
                    return;
                const { EthereumProvider } = await (() => {
                    // safe webpack optional peer dependency dynamic import
                    try {
                        return import('./index.es-6wANxyB2.js').then(function (n) { return n.w; });
                    }
                    catch {
                        throw new Error('dependency "@walletconnect/ethereum-provider" not found');
                    }
                })();
                return await EthereumProvider.init({
                    ...parameters,
                    disableProviderPing: true,
                    optionalChains,
                    projectId: parameters.projectId,
                    rpcMap: Object.fromEntries(config.chains.map((chain) => {
                        const [url] = extractRpcUrls({
                            chain,
                            transports: config.transports,
                        });
                        return [chain.id, url];
                    })),
                    showQrModal: parameters.showQrModal ?? true,
                });
            }
            if (!provider_) {
                if (!providerPromise)
                    providerPromise = initProvider();
                provider_ = await providerPromise;
                provider_?.events.setMaxListeners(Number.POSITIVE_INFINITY);
            }
            if (chainId)
                await this.switchChain?.({ chainId });
            return provider_;
        },
        async getChainId() {
            const provider = await this.getProvider();
            return provider.chainId;
        },
        async isAuthorized() {
            try {
                const [accounts, provider] = await Promise.all([
                    this.getAccounts(),
                    this.getProvider(),
                ]);
                // If an account does not exist on the session, then the connector is unauthorized.
                if (!accounts.length)
                    return false;
                // If the chains are stale on the session, then the connector is unauthorized.
                const isChainsStale = await this.isChainsStale();
                if (isChainsStale && provider.session) {
                    await provider.disconnect().catch(() => { });
                    return false;
                }
                return true;
            }
            catch {
                return false;
            }
        },
        async switchChain({ addEthereumChainParameter, chainId }) {
            const provider = await this.getProvider();
            if (!provider)
                throw new ProviderNotFoundError();
            const chain = config.chains.find((x) => x.id === chainId);
            if (!chain)
                throw new SwitchChainError(new ChainNotConfiguredError());
            let listener = () => { };
            try {
                await Promise.all([
                    new Promise((resolve) => {
                        listener = (opts) => {
                            if (opts.chainId === chainId) {
                                config.emitter.off('change', listener);
                                resolve();
                            }
                        };
                        config.emitter.on('change', listener);
                    }),
                    provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: numberToHex(chainId) }],
                    }),
                ]);
                const requestedChains = await this.getRequestedChainsIds();
                this.setRequestedChainsIds([...requestedChains, chainId]);
                return chain;
            }
            catch (err) {
                config.emitter.off('change', listener);
                const error = err;
                if (/(user rejected)/i.test(error.message))
                    throw new UserRejectedRequestError(error);
                // Indicates chain is not added to provider
                try {
                    let blockExplorerUrls;
                    if (addEthereumChainParameter?.blockExplorerUrls)
                        blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
                    else
                        blockExplorerUrls = chain.blockExplorers?.default.url
                            ? [chain.blockExplorers?.default.url]
                            : [];
                    let rpcUrls;
                    if (addEthereumChainParameter?.rpcUrls?.length)
                        rpcUrls = addEthereumChainParameter.rpcUrls;
                    else
                        rpcUrls = [...chain.rpcUrls.default.http];
                    const addEthereumChain = {
                        blockExplorerUrls,
                        chainId: numberToHex(chainId),
                        chainName: addEthereumChainParameter?.chainName ?? chain.name,
                        iconUrls: addEthereumChainParameter?.iconUrls,
                        nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
                        rpcUrls,
                    };
                    await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [addEthereumChain],
                    });
                    const requestedChains = await this.getRequestedChainsIds();
                    this.setRequestedChainsIds([...requestedChains, chainId]);
                    return chain;
                }
                catch (error) {
                    throw new UserRejectedRequestError(error);
                }
            }
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0)
                this.onDisconnect();
            else
                config.emitter.emit('change', {
                    accounts: accounts.map((x) => getAddress(x)),
                });
        },
        onChainChanged(chain) {
            const chainId = Number(chain);
            config.emitter.emit('change', { chainId });
        },
        async onConnect(connectInfo) {
            const chainId = Number(connectInfo.chainId);
            const accounts = await this.getAccounts();
            config.emitter.emit('connect', { accounts, chainId });
        },
        async onDisconnect(_error) {
            this.setRequestedChainsIds([]);
            config.emitter.emit('disconnect');
            const provider = await this.getProvider();
            if (accountsChanged) {
                provider.removeListener('accountsChanged', accountsChanged);
                accountsChanged = undefined;
            }
            if (chainChanged) {
                provider.removeListener('chainChanged', chainChanged);
                chainChanged = undefined;
            }
            if (disconnect) {
                provider.removeListener('disconnect', disconnect);
                disconnect = undefined;
            }
            if (sessionDelete) {
                provider.removeListener('session_delete', sessionDelete);
                sessionDelete = undefined;
            }
            if (!connect) {
                connect = this.onConnect.bind(this);
                provider.on('connect', connect);
            }
        },
        onDisplayUri(uri) {
            config.emitter.emit('message', { type: 'display_uri', data: uri });
        },
        onSessionDelete() {
            this.onDisconnect();
        },
        getNamespaceChainsIds() {
            if (!provider_)
                return [];
            const chainIds = provider_.session?.namespaces[NAMESPACE]?.accounts?.map((account) => Number.parseInt(account.split(':')[1] || '', 10));
            return chainIds ?? [];
        },
        async getRequestedChainsIds() {
            return ((await config.storage?.getItem(this.requestedChainsStorageKey)) ?? []);
        },
        /**
         * Checks if the target chains match the chains that were
         * initially requested by the connector for the WalletConnect session.
         * If there is a mismatch, this means that the chains on the connector
         * are considered stale, and need to be revalidated at a later point (via
         * connection).
         *
         * There may be a scenario where a dapp adds a chain to the
         * connector later on, however, this chain will not have been approved or rejected
         * by the wallet. In this case, the chain is considered stale.
         */
        async isChainsStale() {
            if (!isNewChainsStale)
                return false;
            const connectorChains = config.chains.map((x) => x.id);
            const namespaceChains = this.getNamespaceChainsIds();
            if (namespaceChains.length &&
                !namespaceChains.some((id) => connectorChains.includes(id)))
                return false;
            const requestedChains = await this.getRequestedChainsIds();
            return !connectorChains.every((id) => requestedChains.includes(id));
        },
        async setRequestedChainsIds(chains) {
            await config.storage?.setItem(this.requestedChainsStorageKey, chains);
        },
        get requestedChainsStorageKey() {
            return `${this.id}.requestedChains`;
        },
    }));
}

var config = createConfig({
	chains: [
		polygon,
		polygonMumbai,
		localhost,
		mainnet
	],
	connectors: [
		injected(),
		walletConnect({
			projectId: "bbcddcc5afbf6cd4b9daface6c2aa284",
			metadata: {
				name: "Sephar Studios",
				description: "Premium streaming platform with Web3 integration",
				url: "https://sepharstudios.com",
				icons: ["https://sepharstudios.com/icon.png"]
			}
		}),
		coinbaseWallet({
			appName: "Sephar Studios",
			appLogoUrl: "https://sepharstudios.com/icon.png"
		})
	],
	transports: {
		[polygon.id]: http("https://polygon-mainnet.g.alchemy.com/v2/jDZ151u9mGIroWRG3tE_9"),
		[polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
		[localhost.id]: http("http://127.0.0.1:8545"),
		[mainnet.id]: http("https://eth.llamarpc.com")
	}
});
var CONTRACT_ADDRESSES = {
	[polygon.id]: {
		studioToken: "",
		sepharSubscription: "",
		creatorPayments: "",
		tokenAMM: "",
		usdcToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
	},
	[polygonMumbai.id]: {
		studioToken: "",
		sepharSubscription: "",
		creatorPayments: "",
		tokenAMM: "",
		usdcToken: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
	},
	[localhost.id]: {
		studioToken: "",
		sepharSubscription: "",
		creatorPayments: "",
		tokenAMM: "",
		usdcToken: ""
	}
};
var DEFAULT_CHAIN = polygonMumbai;
/**
* Get contract addresses for a specific chain
*/
function getContractAddresses(chainId) {
	return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonMumbai.id];
}

export { ChainNotConfiguredError as C, DEFAULT_CHAIN as D, EventEmitter as E, SwitchChainNotSupportedError as S, ConnectorAccountNotFoundError as a, ConnectorAlreadyConnectedError as b, ConnectorChainMismatchError as c, ConnectorNotConnectedError as d, ConnectorUnavailableReconnectingError as e, coinbaseWallet as f, commonjsGlobal as g, config as h, getAugmentedNamespace as i, getConnection as j, getContractAddresses as k, getDefaultExportFromCjs as l, injected as m, walletConnect as w };
//# sourceMappingURL=config-DS-2WH1m.js.map
