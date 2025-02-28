import { Command } from 'commander';

import { GlobalCliOptions, WithdrawOptions } from '../model/commander';
import { withdraw } from '../service/domain/withdraw';
import {
  parseAndValidateValidatorPubKeys,
  parseAndValidateWithdrawAmount
} from '../service/validation/cli';

const withdrawCommand = new Command();

const validatorOptionName = 'validator';
const amountOptionName = 'amount';

withdrawCommand
  .name('withdraw')
  .description('Partially withdraw ETH from one or many validators')
  .requiredOption(
    `-v, --${validatorOptionName} <validatorPubkey...>`,
    'Space separated list of validator pubkeys for which partially withdraws will be perfomed',
    parseAndValidateValidatorPubKeys
  )
  .requiredOption(
    `-a, --${amountOptionName} <amount>`,
    'Amount (in ETH notation) which will be withdrawn from validator',
    parseAndValidateWithdrawAmount
  )
  .action(async (options: WithdrawOptions, command) => {
    const globalOptions: GlobalCliOptions = command.parent.opts();
    await withdraw(globalOptions, options.validator, options.amount);
  });

export { withdrawCommand };
