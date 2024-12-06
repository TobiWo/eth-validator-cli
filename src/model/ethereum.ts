import { JsonRpcProvider, Wallet } from 'ethers';

export interface EthereumConnection {
  wallet: Wallet;
  provider: JsonRpcProvider;
}

export interface NetworkConfig {
  consolidationContractAddress: string;
  withdrawalContractAddress: string;
  chainId: bigint;
}
