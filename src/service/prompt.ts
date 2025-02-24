import chalk from 'chalk';
import { exit } from 'process';
import Prompts from 'prompts';

import * as logging from '../constants/logging';

/**
 * Prompt the user for a secret
 *
 * @param message - The output to be displayed for the user
 * @returns The secret entered by the user
 */
export async function promptSecret(message: string): Promise<string> {
  const answer = await Prompts({
    type: 'password',
    name: 'value',
    message: message
  });
  if (answer.value === undefined) {
    console.error(chalk.red(logging.NO_PRIVATE_KEY_ERROR));
    exit(1);
  }
  return answer.value;
}
