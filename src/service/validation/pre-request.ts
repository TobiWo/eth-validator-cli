import chalk from 'chalk';
import { exit } from 'process';
import { fetch, Response } from 'undici';

import { ValidatorResponse } from '../../model/ethereum';

/**
 * Check if the target validator's withdrawal credentials are of type compounding
 *
 * @param beaconApiUrl - The beacon api url
 * @param targetValidatorPubKey - The target validator's public key
 */
export async function checkWithdrawalCredentialType(
  beaconApiUrl: string,
  targetValidatorPubKey?: string
): Promise<void> {
  if (!targetValidatorPubKey) return;
  try {
    const url = `${beaconApiUrl}/eth/v1/beacon/states/head/validators/${targetValidatorPubKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    const data = (await response.json()) as ValidatorResponse;

    const withdrawalCredentialsType = data.data.validator.withdrawal_credentials.substring(0, 4);
    if (withdrawalCredentialsType !== '0x02') {
      await handleWithdrawalCredentialsType(withdrawalCredentialsType);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(chalk.red('Error while calling beacon API endpoint:', error.cause));
    } else {
      console.error(chalk.red('Unexpected error:', error));
    }
    exit(1);
  }
}

/**
 * Handle error response
 *
 * @param response - The response object
 */
async function handleErrorResponse(response: Response) {
  console.error(chalk.red(`Error while calling beacon API endpoint: ${response.statusText}`));
  console.error(chalk.red(`Response error: ${response.status} - ${await response.text()}`));
  exit(1);
}

/**
 * Handle withdrawal credentials type
 *
 * @param withdrawalCredentialsType - The withdrawal credentials type
 */
async function handleWithdrawalCredentialsType(withdrawalCredentialsType: string) {
  console.error(
    chalk.red(
      `Your target validator has withdrawal credentials of type: ${withdrawalCredentialsType}.`,
      'It needs to have 0x02 credentials. Please update your withdrawal credentials.'
    )
  );
  if (withdrawalCredentialsType === '0x00') {
    console.error(
      chalk.red(
        'You cannot directly change the withdrawal credentials to type 0x02. You need to change to type 0x01 first.',
        'Please follow the instructions here: https://github.com/ethereum/staking-deposit-cli?tab=readme-ov-file#generate-bls-to-execution-change-arguments or other respective documentation.'
      )
    );
  } else {
    console.error(
      chalk.red(
        "You can change the withdrawal credential type from 0x01 to 0x02 using the 'switch' subcommand."
      )
    );
  }
  exit(1);
}
