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

export interface ExecutionLayerRequestTransaction {
  to: string;
  data: string;
  value: bigint;
  gasLimit: bigint;
}
