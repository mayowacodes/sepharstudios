import { s as spread_props, p as prevent_snippet_stringification, az as derived$1, x as writable, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { I as Icon } from './Icon-DVHDtCfs.js';
import { C as ConnectorAlreadyConnectedError, S as SwitchChainNotSupportedError, a as ChainNotConfiguredError, c as coinbaseWallet, w as walletConnect, b as injected, d as config, D as DEFAULT_CHAIN } from './config-DiSGGbdB.js';
import { g as getAccount } from './getAccount-CAZUvBhV.js';

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

Wallet[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/icons/wallet.svelte";
function Wallet($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { $$slots, $$events, ...props } = $$props;
      const iconNode = [
        [
          "path",
          {
            "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
          }
        ],
        ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]
      ];
      Icon($$renderer2, spread_props([
        { name: "wallet" },
        /**
         * @component @name Wallet
         * @description Lucide SVG icon component, renders SVG Element with children.
         *
         * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgN1Y0YTEgMSAwIDAgMC0xLTFINWEyIDIgMCAwIDAgMCA0aDE1YTEgMSAwIDAgMSAxIDF2NGgtM2EyIDIgMCAwIDAgMCA0aDNhMSAxIDAgMCAwIDEtMXYtMmExIDEgMCAwIDAtMS0xIiAvPgogIDxwYXRoIGQ9Ik0zIDV2MTRhMiAyIDAgMCAwIDIgMmgxNWExIDEgMCAwIDAgMS0xdi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/wallet
         * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
         *
         * @param {Object} props - Lucide icons props and any valid SVG attribute
         * @returns {FunctionalComponent} Svelte component
         *
         */
        props,
        {
          iconNode,
          children: prevent_snippet_stringification(($$renderer3) => {
            props.children?.($$renderer3);
            $$renderer3.push(`<!---->`);
          }),
          $$slots: { default: true }
        }
      ]));
    },
    Wallet
  );
}
Wallet.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
const account = writable(void 0);
if (typeof window !== "undefined") {
  account.set(getAccount(config));
}
const walletAddress = derived$1(account, ($account) => $account?.address);
const isConnected = derived$1(account, ($account) => $account?.isConnected ?? false);
function updateAccountState() {
  const currentAccount = getAccount(config);
  account.set(currentAccount);
}
async function connectWallet(connectorType = "injected") {
  try {
    const connectorMap = {
      injected: injected(),
      walletConnect: walletConnect({ projectId: "bbcddcc5afbf6cd4b9daface6c2aa284" }),
      coinbase: coinbaseWallet({ appName: "StudioChain" })
    };
    const connector = connectorMap[connectorType];
    const result = await connect(config, { connector });
    if (result.chainId !== DEFAULT_CHAIN.id) {
      await switchChain(config, { chainId: DEFAULT_CHAIN.id });
    }
    updateAccountState();
    return result;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    updateAccountState();
    throw error;
  }
}
async function disconnectWallet() {
  try {
    await disconnect(config);
    updateAccountState();
  } catch (error) {
    console.error("Failed to disconnect wallet:", error);
    throw error;
  }
}
async function autoConnect() {
  try {
    const isAutoConnect = localStorage.getItem("wagmi.wallet");
    if (isAutoConnect) {
      updateAccountState();
      const currentAccount = getAccount(config);
      if (currentAccount.isConnected && currentAccount.address) {
        console.log("Auto-connected to wallet:", currentAccount.address);
      }
    }
  } catch (error) {
    console.error("Auto-connect failed:", error);
  }
}
function formatAddress(address, length = 4) {
  if (!address) return "";
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`;
}
if (typeof window !== "undefined") {
  autoConnect();
}

export { Wallet as W, account as a, connectWallet as c, disconnectWallet as d, formatAddress as f, isConnected as i, walletAddress as w };
//# sourceMappingURL=wallet-DdtFC4L6.js.map
