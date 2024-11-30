import chalk from 'chalk';
import { JsonRpcProvider, toBeHex, toBigInt, Wallet } from 'ethers';

import * as serviceConstants from '../../constants/service';
import { GlobalCliOptions } from '../../model/commander';
import { networkConfig } from '../../network-config';
import { createEthereumConnection, getRequiredFee } from './ethereum';

/**
 * Consolidate one or many validators to one or switch withdrawal credential type from 0x01 to 0x02
 *
 * @param globalOptions - The global cli options
 * @param sourceValidatorPubkeys - The validator pubkey(s) which will be consolidated / for which withdrawal credential type will be switched
 * @param targetValidatorPubkey - The target validator for consolidation
 */
export async function consolidate(
  globalOptions: GlobalCliOptions,
  sourceValidatorPubkeys: string[],
  targetValidatorPubkey?: string
): Promise<void> {
  logConsolidationWarning(targetValidatorPubkey);
  const ethereumConnection = await createEthereumConnection(globalOptions.jsonRpcUrl);
  for (const sourceValidator of sourceValidatorPubkeys) {
    const consolidationRequestData = createConsolidationRequestData(
      sourceValidator,
      targetValidatorPubkey
    );
    await sendConsolidationRequest(
      ethereumConnection.provider,
      ethereumConnection.wallet,
      globalOptions.network,
      consolidationRequestData
    );
  }
}

/**
 * Send consolidation request via json rpc connection
 *
 * @param jsonRpcProvider - The connected json rpc provider
 * @param wallet - The wallet from which request will be sent
 * @param network - The network used for loading network specific configuration
 * @param consolidationRequestData - The data sent to consolidation contract
 */
async function sendConsolidationRequest(
  jsonRpcProvider: JsonRpcProvider,
  wallet: Wallet,
  network: string,
  consolidationRequestData: string
) {
  try {
    const consolidationQueue = await jsonRpcProvider.getStorage(
      networkConfig[network].consolidationContractAddress,
      toBeHex(0)
    );
    const requiredFee =
      getRequiredFee(toBigInt(consolidationQueue)) + serviceConstants.TRANSACTION_TIP;
    const consolidationRequestTrx = {
      to: networkConfig[network].consolidationContractAddress,
      data: consolidationRequestData,
      value: requiredFee
    };
    const response = await wallet.sendTransaction(consolidationRequestTrx);
    await response.wait();
    console.log('Sent execution layer request:', response.hash);
  } catch (error) {
    console.error('Error Sending Transaction:', error);
  }
}

/**
 * Create consolidation request data
 *
 * @param sourceValidatorPubkey - The validator pubkey(s) which will be consolidated / for which withdrawal credential type will be switched
 * @param targetValidatorPubkey - The target validator for consolidation
 * @returns The consolidation request data
 */
function createConsolidationRequestData(
  sourceValidatorPubkey: string,
  targetValidatorPubkey?: string
): string {
  let consolidationRequestData = '0x'.concat(sourceValidatorPubkey.substring(2));
  if (targetValidatorPubkey) {
    consolidationRequestData = consolidationRequestData.concat(targetValidatorPubkey.substring(2));
  } else {
    consolidationRequestData = consolidationRequestData.concat(sourceValidatorPubkey.substring(2));
  }
  return consolidationRequestData;
}

/**
 * Log consolidation specific warning
 *
 * @param targetValidatorPubkey - The target validator for consolidation
 */
function logConsolidationWarning(targetValidatorPubkey?: string): void {
  if (targetValidatorPubkey) {
    console.log(
      chalk.yellow(
        'Attention: You can only consolidate validators with the same withdrawal credentials!'
      )
    );
  }
}
