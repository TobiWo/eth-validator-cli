#! /usr/bin/env node

import { Command, Option } from 'commander';

import { GlobalCliOptions } from '../model/commander';
import {
  parseAndValidateMaxNumberOfRequestsPerBlock,
  parseAndValidateNodeUrl,
  validateNetwork
} from '../service/validation/cli';
import { consolidateCommand } from './consolidate';
import { switchWithdrawalCredentialTypeCommand } from './switch';

const program = new Command();

const networkOptionName = 'network';
const jsonRpcOptionName = 'json-rpc-url';
const beaconApiOptionName = 'beacon-api-url';
const maxRequestsPerBlockOptionName = 'max-requests-per-block';

program
  .name('eth-validator-cli')
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
  .addCommand(switchWithdrawalCredentialTypeCommand);

program.parseAsync(process.argv).then(() => {});
