import { Command } from 'commander';

import { ConsolidationOptions, GlobalCliOptions } from '../model/commander';
import {
  parseAndValidateValidatorPubKey,
  parseAndValidateValidatorPubKeys
} from '../service/cli-validation';
import { consolidate } from '../service/domain/consolidate';

const consolidateCommand = new Command();

const sourceValidatorOptionName = 'source';
const targetValidatorOptionName = 'target';

consolidateCommand
  .name('consolidate')
  .description('Consolidate one or many source validators into one target validator')
  .requiredOption(
    `-s, --${sourceValidatorOptionName} <validatorPubkey...>`,
    'Space separated list of validator pubkeys which will be consolidated into the target validator',
    parseAndValidateValidatorPubKeys
  )
  .requiredOption(
    `-t, --${targetValidatorOptionName} <validatorPubkey>`,
    'Target validator pubkey',
    parseAndValidateValidatorPubKey
  )
  .action(async (options: ConsolidationOptions, command) => {
    const globalOptions: GlobalCliOptions = command.parent.opts();
    await consolidate(globalOptions, options.source, options.target);
  });

export { consolidateCommand };
