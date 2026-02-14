import hre from "hardhat";
import * as fs from "fs";
import type { Address } from "viem";

// Type assertion for viem helpers
const viemHelpers = (hre as unknown as { viem: Record<string, unknown> }).viem;

interface DeploymentAddresses {
  studioToken: Address;
  sepharSubscription: Address;
  creatorPayments: Address;
  tokenAMM: Address;
  usdcToken?: Address;
}

function getNetworkName(chainId: number): string {
  switch (chainId) {
    case 1: return "mainnet";
    case 137: return "polygon";
    case 80002: return "amoy";        // Amoy testnet (new)
    case 80001: return "mumbai";      // Mumbai testnet (deprecated)
    case 11155111: return "sepolia";
    case 31337: return "localhost";
    default: return `unknown-${chainId}`;
  }
}

async function main() {
  console.log("🚀 Starting Sephar Studios tokenomics deployment...\n");

  // Get viem instance and clients using Hardhat v3 pattern
  const publicClient = await (viemHelpers.getPublicClient as () => Promise<unknown>)();
  const [walletClient] = await (viemHelpers.getWalletClients as () => Promise<unknown[]>)();

  console.log("Deploying contracts with account:", (walletClient as { account: { address: string } }).account.address);

  const balance = await (publicClient as { getBalance: (params: { address: string }) => Promise<bigint> }).getBalance({
    address: (walletClient as { account: { address: string } }).account.address
  });
  console.log("Account balance:", balance.toString());

  const deploymentAddresses: DeploymentAddresses = {
    studioToken: "0x" as Address,
    sepharSubscription: "0x" as Address,
    creatorPayments: "0x" as Address,
    tokenAMM: "0x" as Address,
  };

  // Detect network
  const chainId = await (publicClient as { getChainId: () => Promise<number> }).getChainId();
  const networkName = getNetworkName(chainId);
  console.log(`🌐 Deploying on network: ${networkName} (chainId: ${chainId})`);
  let usdcAddress: Address;

  if (chainId === 137) {
    usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as Address;
  } else if (chainId === 80001) {
    usdcAddress = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e" as Address;
  } else {
    console.log("📝 Deploying mock USDC token...");
    usdcAddress = await (viemHelpers.deployContract as (name: string, args: unknown[]) => Promise<Address>)("MockUSDC", []);
    console.log("✅ Mock USDC deployed to:", usdcAddress);
  }

  deploymentAddresses.usdcToken = usdcAddress;

  // Treasury setup
  const platformTreasury = (walletClient as { account: { address: string } }).account.address;
  const creatorRewardsPool = (walletClient as { account: { address: string } }).account.address;
  const userRewardsPool = (walletClient as { account: { address: string } }).account.address;
  const governancePool = (walletClient as { account: { address: string } }).account.address;
  const usdcTreasury = (walletClient as { account: { address: string } }).account.address;

  // 1. Deploy Studio Token
  console.log("\n📝 Deploying Studio Token...");
  deploymentAddresses.studioToken = await (viemHelpers.deployContract as (name: string, args: unknown[]) => Promise<Address>)("StudioToken", [
    platformTreasury,
    creatorRewardsPool,
    userRewardsPool,
    governancePool,
    usdcAddress
  ]);
  console.log("✅ Studio Token deployed to:", deploymentAddresses.studioToken);

  // 2. Deploy Token AMM
  console.log("\n📝 Deploying Token AMM...");
  deploymentAddresses.tokenAMM = await (viemHelpers.deployContract as (name: string, args: unknown[]) => Promise<Address>)("TokenAMM", [
    deploymentAddresses.studioToken,
    usdcAddress,
    platformTreasury
  ]);
  console.log("✅ Token AMM deployed to:", deploymentAddresses.tokenAMM);

  // 3. Deploy Subscription NFTs
  console.log("\n📝 Deploying Sephar Studios Subscription...");
  deploymentAddresses.sepharSubscription = await (viemHelpers.deployContract as (name: string, args: unknown[]) => Promise<Address>)("SepharSubscription", [
    deploymentAddresses.studioToken,
    usdcAddress,
    platformTreasury,
    creatorRewardsPool,
    userRewardsPool,
    deploymentAddresses.tokenAMM
  ]);
  console.log("✅ Subscription deployed to:", deploymentAddresses.sepharSubscription);

  // 4. Deploy Creator Payments (AFTER TokenAMM)
  console.log("\n📝 Deploying Creator Payments...");
  deploymentAddresses.creatorPayments = await (viemHelpers.deployContract as (name: string, args: unknown[]) => Promise<Address>)("CreatorPayments", [
    deploymentAddresses.studioToken,
    usdcAddress,
    platformTreasury,
    usdcTreasury,
    deploymentAddresses.tokenAMM
  ]);
  console.log("✅ Creator Payments deployed to:", deploymentAddresses.creatorPayments);

  // 5. Configure contracts
  console.log("\n⚙️ Configuring contracts...");

  // Set TokenAMM address in StudioToken
  const stcTokenContract = await (viemHelpers.getContractAt as (name: string, address: Address) => Promise<{ write: { setTokenAMM: (args: [Address]) => Promise<void> } }>)("StudioToken", deploymentAddresses.studioToken);
  await stcTokenContract.write.setTokenAMM([deploymentAddresses.tokenAMM]);
  console.log("✅ TokenAMM address set in StudioToken");

  // 6. Save deployment
  const deploymentData = {
    network: networkName,
    chainId: chainId.toString(),
    timestamp: new Date().toISOString(),
    deployer: (walletClient as { account: { address: string } }).account.address,
    contracts: deploymentAddresses,
  };

  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync(
    `deployments/${networkName}-${chainId.toString()}.json`,
    JSON.stringify(deploymentData, null, 2)
  );

  console.log(`💾 Deployment data saved to deployments/${networkName}-${chainId.toString()}.json`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 Deployment Summary:");
  console.log(`- Network: ${networkName} (${chainId})`);
  console.log(`- Studio Token: ${deploymentAddresses.studioToken}`);
  console.log(`- Token AMM: ${deploymentAddresses.tokenAMM}`);
  console.log(`- Subscription NFT: ${deploymentAddresses.sepharSubscription}`);
  console.log(`- Creator Payments: ${deploymentAddresses.creatorPayments}`);
  console.log(`- USDC Token: ${usdcAddress}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
