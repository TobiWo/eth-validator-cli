import { PublicKey } from '@chainsafe/blst';
import { InvalidArgumentError } from 'commander';
import { JsonRpcProvider } from 'ethers';

import { VALID_URL_PREFIXES } from '../../constants/program';
import { networkConfig } from '../../network-config';

/**
 * Check if json rpc url is correctly formatted
 *
 * @param nodeUrl - The json rpc url
 * @returns The json rpc url
 */
export function parseAndValidateNodeUrl(nodeUrl: string): string {
  if (!VALID_URL_PREFIXES.some((prefix) => nodeUrl.startsWith(prefix))) {
    throw new InvalidArgumentError('The provided url should start with http:// or https://');
  }
  return nodeUrl;
}

/**
 * Check if amount to withdraw is a number
 *
 * @param amount - The amount in ETH to withdraw from validator
 * @returns The amount in ETH to withdraw from validator
 */
export function parseAndValidateAmount(amount: string): number {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    throw new InvalidArgumentError(`Amount should be a number`);
  }
  return parsedAmount;
}

/**
 * Check if provided validator pubkey is valid
 *
 * @param validatorPubKey - The provided validator pubkey
 * @returns The validator pubkey
 */
export function parseAndValidateValidatorPubKey(validatorPubKey: string): string {
  try {
    PublicKey.fromHex(validatorPubKey).keyValidate();
    return addPubKeyPrefix(validatorPubKey);
  } catch {
    throw new InvalidArgumentError('Supplied validator pubkey is not valid');
  }
}

/**
 * Check if provided validator pubkeys are valid
 *
 * @param validatorPubKey - The provided validator pubkey
 * @param previous - The previous provided validator pubkeys
 * @returns The validator pubkeys
 */
export function parseAndValidateValidatorPubKeys(
  validatorPubKey: string,
  previous: string[] = []
): string[] {
  try {
    PublicKey.fromHex(validatorPubKey).keyValidate();
    return [...previous, addPubKeyPrefix(validatorPubKey)];
  } catch {
    throw new InvalidArgumentError('One or many of the supplied validator pubkeys are not valid');
  }
}

/**
 * Check if provided json rpc url connection can be established
 *
 * @param jsonRpcUrl - The json rpc url
 * @param network - The user provided network
 */
export async function validateNetwork(jsonRpcUrl: string, network: string): Promise<void> {
  try {
    const jsonRpcProvider = new JsonRpcProvider(jsonRpcUrl);
    const connectedNetwork = await jsonRpcProvider.getNetwork();
    if (connectedNetwork.chainId != networkConfig[network].chainId) {
      throw new InvalidArgumentError(
        `Provided json rpc url is not connected to network ${network}! Url points to ${connectedNetwork.name} with chainid ${connectedNetwork.chainId}`
      );
    }
  } catch (error) {
    throw new InvalidArgumentError(
      `Error while trying to open connection for provided json rpc url: ${error}`
    );
  }
}

/**
 * Check if provided max. number of requests per block is a actual number and does not exceed
 * a the number of execution layer requests which would fit into a single block.
 *
 * @param maxNumberOfRequests - The maximal number of requests allowed in a single block
 * @returns The validated maximal number of requests allowed in a single block
 */
export function parseAndValidateMaxNumberOfRequestsPerBlock(maxNumberOfRequests: string): number {
  const parsedNumber = parseInt(maxNumberOfRequests);
  if (isNaN(parsedNumber)) {
    throw new InvalidArgumentError(`Number of max. requests per block should be a number`);
  }
  if (parsedNumber > 220) {
    throw new InvalidArgumentError(
      `Provided maximal number of requests per block is too high. 
      The estimated max. per block is 220-230 requests. If this is exceeded the probability increases that 
      that request transactions will be reverted due to an insufficient fee calculated for the requests.`
    );
  }
  return parsedNumber;
}

/**
 * Add 0x suffix to validator pubkey if not present
 *
 * @param validatorPubKey - The validator pubkey to check
 * @returns The validator pubkey with suffix 0x
 */
function addPubKeyPrefix(validatorPubKey: string): string {
  if (!validatorPubKey.startsWith('0x')) {
    validatorPubKey = '0x'.concat(validatorPubKey);
  }
  return validatorPubKey;
}
