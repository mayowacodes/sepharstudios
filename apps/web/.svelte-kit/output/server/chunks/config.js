import { createConfig, http } from "@wagmi/core";
import { localhost, mainnet, polygon, polygonMumbai } from "@wagmi/core/chains";
import { coinbaseWallet, injected, walletConnect } from "@wagmi/connectors";
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
//#endregion
export { config as n, getContractAddresses as r, DEFAULT_CHAIN as t };
