import Prompts from 'prompts';

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
    throw new Error();
  }
  return answer.value;
}
