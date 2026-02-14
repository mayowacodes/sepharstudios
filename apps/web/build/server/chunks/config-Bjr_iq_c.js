import { createConfig, http } from '@wagmi/core';
import { polygon, polygonMumbai, localhost, mainnet } from '@wagmi/core/chains';
import { injected, walletConnect, coinbaseWallet } from '@wagmi/connectors';

const projectId = "demo-project-id";
const config = createConfig({
  chains: [polygon, polygonMumbai, localhost, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId,
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
    [polygon.id]: http("https://polygon-rpc.com"),
    [polygonMumbai.id]: http("https://rpc-mumbai.maticvigil.com"),
    [localhost.id]: http("http://127.0.0.1:8545"),
    [mainnet.id]: http("https://eth.llamarpc.com")
  }
});
const CONTRACT_ADDRESSES = {
  [polygon.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    // Polygon USDC
  },
  [polygonMumbai.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e"
    // Mumbai testnet USDC
  },
  [localhost.id]: {
    studioToken: "",
    sepharSubscription: "",
    creatorPayments: "",
    tokenAMM: "",
    usdcToken: ""
    // Will be deployed locally
  }
};
const DEFAULT_CHAIN = polygonMumbai;
function getContractAddresses(chainId) {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonMumbai.id];
}

export { DEFAULT_CHAIN as D, config as c, getContractAddresses as g };
//# sourceMappingURL=config-Bjr_iq_c.js.map
