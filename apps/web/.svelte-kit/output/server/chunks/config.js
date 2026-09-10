import { n as public_env } from "./shared-server.js";
import { createConfig, http } from "@wagmi/core";
import { localhost, mainnet, polygon, polygonAmoy } from "@wagmi/core/chains";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
//#region src/lib/web3/config.ts
/**
* Web3 chain + contract configuration.
*
* Testnet is AMOY (chainId 80002) — Mumbai (80001) was decommissioned
* by Polygon in April 2024; its RPC endpoints are dead. The Hardhat
* project at packages/contracts already targets amoy (`bun run
* deploy:amoy`).
*
* Contract addresses come from PUBLIC_* env vars so going live is a
* Dokploy env change + restart, not a code edit:
*
*   PUBLIC_WEB3_CHAIN                = amoy | polygon   (default amoy)
*   PUBLIC_STUDIO_TOKEN_ADDRESS      = 0x…  (StudioToken / STC)
*   PUBLIC_SUBSCRIPTION_ADDRESS      = 0x…  (SepharSubscription)
*   PUBLIC_CREATOR_PAYMENTS_ADDRESS  = 0x…  (CreatorPayments)
*   PUBLIC_TOKEN_AMM_ADDRESS         = 0x…  (TokenAMM)
*   PUBLIC_WALLETCONNECT_PROJECT_ID  = optional override
*   PUBLIC_POLYGON_RPC_URL           = optional mainnet RPC override
*
* All four addresses are printed by `packages/contracts` deploy script
* and saved to packages/contracts/deployments/<network>-<chainId>.json.
* While they're unset, lib/web3/contracts.ts throws a descriptive
* error instead of silently calling the zero address.
*/
var projectId = public_env.PUBLIC_WALLETCONNECT_PROJECT_ID || "bbcddcc5afbf6cd4b9daface6c2aa284";
var config = createConfig({
	chains: [
		polygon,
		polygonAmoy,
		localhost,
		mainnet
	],
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
		[polygon.id]: http(public_env.PUBLIC_POLYGON_RPC_URL || "https://polygon-mainnet.g.alchemy.com/v2/jDZ151u9mGIroWRG3tE_9"),
		[polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
		[localhost.id]: http("http://127.0.0.1:8545"),
		[mainnet.id]: http("https://eth.llamarpc.com")
	}
});
var activeChain = (public_env.PUBLIC_WEB3_CHAIN || "amoy").toLowerCase();
var envAddresses = {
	studioToken: public_env.PUBLIC_STUDIO_TOKEN_ADDRESS || "",
	sepharSubscription: public_env.PUBLIC_SUBSCRIPTION_ADDRESS || "",
	creatorPayments: public_env.PUBLIC_CREATOR_PAYMENTS_ADDRESS || "",
	tokenAMM: public_env.PUBLIC_TOKEN_AMM_ADDRESS || ""
};
var emptyAddresses = {
	studioToken: "",
	sepharSubscription: "",
	creatorPayments: "",
	tokenAMM: ""
};
var CONTRACT_ADDRESSES = {
	[polygon.id]: {
		...activeChain === "polygon" ? envAddresses : emptyAddresses,
		usdcToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
	},
	[polygonAmoy.id]: {
		...activeChain === "amoy" ? envAddresses : emptyAddresses,
		usdcToken: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"
	},
	[localhost.id]: {
		...activeChain === "localhost" ? envAddresses : emptyAddresses,
		usdcToken: ""
	}
};
var DEFAULT_CHAIN = activeChain === "polygon" ? polygon : polygonAmoy;
/**
* Get contract addresses for a specific chain
*/
function getContractAddresses(chainId) {
	return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[polygonAmoy.id];
}
//#endregion
export { config as n, getContractAddresses as r, DEFAULT_CHAIN as t };
