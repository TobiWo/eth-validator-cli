import { Command } from 'commander';

import { parseAndValidateValidatorPubKeys } from '../service/cli-validation';
import { consolidate } from '../service/domain/consolidate';

const switchWithdrawalCredentialTypeCommand = new Command();

const validatorOptionName = 'validator';

switchWithdrawalCredentialTypeCommand
  .name('switch')
  .description('Switch withdrawal credential type from 0x01 to 0x02 for one or many validators')
  .requiredOption(
    `-v, --${validatorOptionName} <validatorPubkey...>`,
    'Space separated list of validator pubkeys for which the withdrawal credential type will be changed to 0x02',
    parseAndValidateValidatorPubKeys
  )
  .action(async (options, command) => {
    await consolidate(command.parent.opts(), options.validator);
  });

export { switchWithdrawalCredentialTypeCommand };
