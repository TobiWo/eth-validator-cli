import { NetworkConfig } from './model/ethereum';

export const networkConfig: Record<string, NetworkConfig> = {
  mekong: {
    consolidationContractAddress: '0x01aBEa29659e5e97C95107F20bb753cD3e09bBBb',
    withdrawalContractAddress: '0x09Fc772D0857550724b07B850a4323f39112aAaA',
    chainId: 7078815900n
  },
  kurtosis: {
    consolidationContractAddress: '0x01aBEa29659e5e97C95107F20bb753cD3e09bBBb',
    withdrawalContractAddress: '0x09Fc772D0857550724b07B850a4323f39112aAaA',
    chainId: 3151908n
  }
};
