import {
  CONSOLIDATION_CONTRACT_ADDRESS,
  WITHDRAWAL_CONTRACT_ADDRESS
} from './constants/application';
import { NetworkConfig } from './model/ethereum';

export const networkConfig: Record<string, NetworkConfig> = {
  mekong: {
    consolidationContractAddress: '0x01aBEa29659e5e97C95107F20bb753cD3e09bBBb',
    withdrawalContractAddress: '0x09Fc772D0857550724b07B850a4323f39112aAaA',
    chainId: 7078815900n
  },
  local_pectra_devnet: {
    consolidationContractAddress: CONSOLIDATION_CONTRACT_ADDRESS,
    withdrawalContractAddress: WITHDRAWAL_CONTRACT_ADDRESS,
    chainId: 3151908n
  },
  pectra_devnet_7: {
    consolidationContractAddress: CONSOLIDATION_CONTRACT_ADDRESS,
    withdrawalContractAddress: WITHDRAWAL_CONTRACT_ADDRESS,
    chainId: 7032118028n
  },
  holesky: {
    consolidationContractAddress: CONSOLIDATION_CONTRACT_ADDRESS,
    withdrawalContractAddress: WITHDRAWAL_CONTRACT_ADDRESS,
    chainId: 17000n
  },
  sepolia: {
    consolidationContractAddress: CONSOLIDATION_CONTRACT_ADDRESS,
    withdrawalContractAddress: WITHDRAWAL_CONTRACT_ADDRESS,
    chainId: 11155111n
  },
  mainnet: {
    consolidationContractAddress: CONSOLIDATION_CONTRACT_ADDRESS,
    withdrawalContractAddress: WITHDRAWAL_CONTRACT_ADDRESS,
    chainId: 1n
  }
};
