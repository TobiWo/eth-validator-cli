import { JsonRpcProvider, NonceManager } from 'ethers';

export interface EthereumConnection {
  wallet: NonceManager;
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
