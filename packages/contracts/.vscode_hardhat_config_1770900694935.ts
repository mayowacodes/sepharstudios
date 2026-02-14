import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const config: HardhatUserConfig = {
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
    ...(process.env.MUMBAI_RPC_URL ? {
      mumbai: {
        type: "http" as const,
        url: process.env.MUMBAI_RPC_URL,
        chainId: 80001,
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
};

export default config;
