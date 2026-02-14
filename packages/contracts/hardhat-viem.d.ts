// hardhat-viem.d.ts
import "hardhat/types/runtime";
import type {
  PublicClient,
  WalletClient,
  Address,
  GetContractReturnType
} from "viem";

declare module "hardhat/types/runtime" {
  interface HardhatViemHelpers {
    getPublicClient: () => Promise<PublicClient>;
    getWalletClients: () => Promise<WalletClient[]>;
    deployContract: (
      name: string,
      args?: unknown[],
      options?: { from?: Address }
    ) => Promise<Address>;
    getContractAt: (
      name: string,
      address: Address
    ) => Promise<GetContractReturnType>;
  }

  interface HardhatRuntimeEnvironment {
    viem: HardhatViemHelpers;
  }
}