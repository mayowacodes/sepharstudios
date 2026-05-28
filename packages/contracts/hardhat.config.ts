import type { HardhatUserConfig } from "hardhat/config";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: HardhatUserConfig = {
  plugins: [hardhatViem, hardhatVerify],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ...(process.env.AMOY_RPC_URL ? {
      amoy: {
        type: "http" as const,
        url: process.env.AMOY_RPC_URL,
        chainId: 80002,
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      }
    } : {}),
    ...(process.env.POLYGON_RPC_URL ? {
      polygon: {
        type: "http" as const,
        url: process.env.POLYGON_RPC_URL,
        chainId: 137,
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      }
    } : {}),
    ...(process.env.SEPOLIA_RPC_URL ? {
      sepolia: {
        type: "http" as const,
        url: process.env.SEPOLIA_RPC_URL,
        chainId: 11155111,
        accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      }
    } : {}),
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  verify: {
    etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY || "",
    }
  },
  // hardhat-verify v3 moved custom-chain config to top-level `chainDescriptors`
  // keyed by chainId; `verify.etherscan.customChains` no longer exists.
  chainDescriptors: {
    80002: {
      name: "polygonAmoy",
      blockExplorers: {
        etherscan: {
          url: "https://amoy.polygonscan.com",
          apiUrl: "https://api-amoy.polygonscan.com/api"
        }
      }
    }
  },
};

export default config;
