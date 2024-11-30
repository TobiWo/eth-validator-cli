#! /usr/bin/env node

import { Command, Option } from 'commander';

import { GlobalCliOptions } from '../model/commander';
import { parseAndValidateJsonRpcUrl, validateNetwork } from '../service/cli-validation';
import { consolidateCommand } from './consolidate';
import { switchWithdrawalCredentialTypeCommand } from './switch';

const program = new Command();

const networkOptionName = 'network';
const jsonRpcOptionName = 'json-rpc-url';

program
  .name('eth-validator-cli')
  .addOption(
    new Option(
      `-n, --${networkOptionName} <network>`,
      'Ethereum network which will be used for request processing'
    )
      .choices(['mekong'])
      .makeOptionMandatory(true)
      .default('mekong')
  )
  .requiredOption(
    `-r, --${jsonRpcOptionName} <jsonRpcUrl>`,
    'Json rpc url which is used to connect to the defined network',
    parseAndValidateJsonRpcUrl,
    'http://localhost:8545'
  )
  .hook('preSubcommand', (thisCommand) => {
    const globalOptions: GlobalCliOptions = thisCommand.opts();
    validateNetwork(globalOptions.jsonRpcUrl, globalOptions.network);
  })
  .addCommand(consolidateCommand)
  .addCommand(switchWithdrawalCredentialTypeCommand);

program.parseAsync(process.argv).then(() => {});
