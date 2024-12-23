import chalk from 'chalk';
import { JsonRpcProvider, toBeHex, toBigInt, TransactionReceipt, Wallet } from 'ethers';

import { getRequiredFee } from './ethereum';

/**
 * Send execution layer requests via json rpc connection
 *
 * @param systemContractAddress - The system contract where the request is sent to
 * @param jsonRpcProvider - The connected json rpc provider
 * @param wallet - The wallet from which request will be sent
 * @param requestData - The data sent to system contract
 */
export async function sendExecutionLayerRequests(
  systemContractAddress: string,
  jsonRpcProvider: JsonRpcProvider,
  wallet: Wallet,
  requestData: string[]
) {
  try {
    const contractQueue = await jsonRpcProvider.getStorage(systemContractAddress, toBeHex(0));
    const requiredFee = getRequiredFee(toBigInt(contractQueue) + toBigInt(requestData.length));
    const broadcastedExecutionLayerRequests = await broadcastExecutionLayerRequests(
      systemContractAddress,
      wallet,
      requestData,
      requiredFee
    );
    await Promise.allSettled(mineExecutionLayerRequests(broadcastedExecutionLayerRequests));
  } catch (error) {
    console.error('Error Sending Transaction:', error);
  }
}

/**
 * Broadcast execution layer requests to Ethereum
 *
 * @param systemContractAddress - The system contract where the request is sent to
 * @param wallet - The wallet from which request will be sent
 * @param requestData - The data sent to system contract
 * @param requiredFee - The fee which needs to be sent with the request
 * @returns The broadcasted execution layer requests
 */
async function broadcastExecutionLayerRequests(
  systemContractAddress: string,
  wallet: Wallet,
  requestData: string[],
  requiredFee: bigint
): Promise<Promise<null | TransactionReceipt>[]> {
  const broadcastedExecutionLayerRequests: Promise<null | TransactionReceipt>[] = [];
  for (const data of requestData) {
    const executionLayerRequestTrx = {
      to: systemContractAddress,
      data: data,
      value: requiredFee
    };
    const executionLayerRequestResponse = await wallet.sendTransaction(executionLayerRequestTrx);
    console.log(
      chalk.yellow(
        'Broadcasting execution layer request:',
        executionLayerRequestResponse.hash,
        '...'
      )
    );
    broadcastedExecutionLayerRequests.push(executionLayerRequestResponse.wait());
  }
  return broadcastedExecutionLayerRequests;
}

/**
 * Include broadcasted execution layer requests into blocks
 *
 * @param broadcastedTransactions - The already broadcasted execution layer requests
 */
function mineExecutionLayerRequests(
  broadcastedTransactions: Promise<null | TransactionReceipt>[]
): Promise<void>[] {
  return broadcastedTransactions.map((broadcastedTransaction) =>
    broadcastedTransaction
      .then((broadcastResult) => {
        if (broadcastResult) {
          console.log(chalk.green('Mined execution layer request:', broadcastResult.hash));
        }
      })
      .catch((error) => {
        console.error(error);
      })
  );
}
