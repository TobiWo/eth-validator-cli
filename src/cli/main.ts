#! /usr/bin/env node
import chalk from 'chalk';
import { Command, Option } from 'commander';

import { DISCLAIMER_INFO } from '../constants/logging';
import { GlobalCliOptions } from '../model/commander';
import {
  parseAndValidateMaxNumberOfRequestsPerBlock,
  parseAndValidateNodeUrl,
  validateNetwork
} from '../service/validation/cli';
import { consolidateCommand } from './consolidate';
import { exitCommand } from './exit';
import { switchWithdrawalCredentialTypeCommand } from './switch';
import { withdrawCommand } from './withdraw';

const program = new Command();

const networkOptionName = 'network';
const jsonRpcOptionName = 'json-rpc-url';
const beaconApiOptionName = 'beacon-api-url';
const maxRequestsPerBlockOptionName = 'max-requests-per-block';

program
  .name('eth-validator-cli')
  .description(`CLI tool for managing Ethereum validators.\n${chalk.yellow(DISCLAIMER_INFO)}`)
  .version('0.4.0')
  .addOption(
    new Option(
      `-n, --${networkOptionName} <network>`,
      'Ethereum network which will be used for request processing'
    )
      .choices(['holesky', 'sepolia', 'mekong', 'local_pectra_devnet', 'pectra_devnet_7'])
      .makeOptionMandatory(true)
      .default('local_pectra_devnet')
  )
  .requiredOption(
    `-r, --${jsonRpcOptionName} <jsonRpcUrl>`,
    'Json rpc url which is used to connect to the defined network',
    parseAndValidateNodeUrl,
    'http://localhost:8545'
  )
  .requiredOption(
    `-b, --${beaconApiOptionName} <beaconApiUrl>`,
    'Beacon api url which is used for pre transaction checks',
    parseAndValidateNodeUrl,
    'http://localhost:5052'
  )
  .requiredOption(
    `-m, --${maxRequestsPerBlockOptionName} <number>`,
    'Max. number of sent execution layer requests per block',
    parseAndValidateMaxNumberOfRequestsPerBlock,
    10
  )
  .hook('preSubcommand', (thisCommand) => {
    const globalOptions: GlobalCliOptions = thisCommand.opts();
    validateNetwork(globalOptions.jsonRpcUrl, globalOptions.network);
  })
  .addCommand(consolidateCommand)
  .addCommand(switchWithdrawalCredentialTypeCommand)
  .addCommand(withdrawCommand)
  .addCommand(exitCommand);

program.parseAsync(process.argv).then(() => {});
