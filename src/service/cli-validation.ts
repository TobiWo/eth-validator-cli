import { PublicKey } from '@chainsafe/blst';
import { InvalidArgumentError } from 'commander';
import { JsonRpcProvider } from 'ethers';

import { VALID_URL_PREFIXES } from '../constants/service';
import { networkConfig } from '../network-config';

/**
 * Check if json rpc url is correctly formatted
 *
 * @param jsonRpcUrl - The json rpc url
 * @returns The json rpc url
 */
export function parseAndValidateJsonRpcUrl(jsonRpcUrl: string): string {
  if (!VALID_URL_PREFIXES.some((prefix) => jsonRpcUrl.startsWith(prefix))) {
    throw new InvalidArgumentError('Json rpc url should start with http:// or https://');
  }
  return jsonRpcUrl;
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
