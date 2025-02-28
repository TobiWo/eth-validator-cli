import { PREFIX_0x } from '../../constants/application';
import { GlobalCliOptions } from '../../model/commander';
import { networkConfig } from '../../network-config';
import { createEthereumConnection } from './ethereum';
import { sendExecutionLayerRequests } from './request';

/**
 * Withdraw a provided amount from one or many validators
 *
 * @param globalOptions - The global cli options
 * @param validatorPubkeys - The validator pubkey(s) which are used to withdraw the provided amount or for an exit
 * @param amount - 8-byte hexstring representation of the withdraw amount
 */
export async function withdraw(
  globalOptions: GlobalCliOptions,
  validatorPubkeys: string[],
  amount: string
): Promise<void> {
  const ethereumConnection = await createEthereumConnection(globalOptions.jsonRpcUrl);
  const withdrawalRequestData: string[] = [];
  for (const validator of validatorPubkeys) {
    const request = PREFIX_0x.concat(validator.substring(2)).concat(amount);
    withdrawalRequestData.push(request);
  }
  await sendExecutionLayerRequests(
    networkConfig[globalOptions.network].withdrawalContractAddress,
    ethereumConnection.provider,
    ethereumConnection.wallet,
    withdrawalRequestData,
    globalOptions.maxRequestsPerBlock
  );
}
