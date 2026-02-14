import { g as spread_props, p as prevent_snippet_stringification } from './index-C14HL8mA.js';
import { I as Icon } from './Icon-DLeFNkXp.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import { connect, switchChain, disconnect, getAccount } from '@wagmi/core';
import { c as config, D as DEFAULT_CHAIN } from './config-Bjr_iq_c.js';
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors';
import { d as derived, w as writable } from './index3-CnQVvK5M.js';

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
const walletAddress = derived(account, ($account) => $account?.address);
const isConnected = derived(account, ($account) => $account?.isConnected ?? false);
function updateAccountState() {
  const currentAccount = getAccount(config);
  account.set(currentAccount);
}
async function connectWallet(connectorType = "injected") {
  try {
    const connectorMap = {
      injected: injected(),
      walletConnect: walletConnect({ projectId: "demo-project-id" }),
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
//# sourceMappingURL=wallet-B7_7GztS.js.map
