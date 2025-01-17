# eth-validator-cli

CLI tool for managing Ethereum validators via execution layer requests. This cli currently only supports validator related features included in the Pectra hardfork.

**Please find the latest [release here](https://github.com/TobiWo/eth-validator-cli/releases).**

## Supported networks

* mekong

## Features

* Consolidate one or multiple source validators to one target validator
* Switch withdrawal credentials from type 0x01 to 0x02 (compounding)

## Usage

1. Send consolidation request

    ```bash
    ./eth-validator-cli --json-rpc-url <CONNECTION_STRING_TO_JSON_RPC_ENDPOINT> consolidate --source <SPACE_SEPARATED_LIST_OF_VALIDATORS_WHICH_SHOULD_BE_CONSOLIDATED_INTO_TARGET_VALIDATOR> --target <TARGET_VALIDATOR>
    ```

1. Send request for switching withdrawal credential type

    ```bash
    ./eth-validator-cli --json-rpc-url <CONNECTION_STRING_TO_JSON_RPC_ENDPOINT> switch --validator <SPACE_SEPARATED_LIST_OF_VALIDATORS_FO_WHICH_TO_SWITCH_WITHDRAWAL_CREDENTIAL_TYPE>
    ```

## Build the application

You will only find a binary for linux in the release section currently. This will change in the future. You need to build the application on your own if you have a different system/architecture.

1. Install [Node 22](https://nodejs.org/en)
1. Install dependencies

    ```bash
    npm i
    ```

1. Build and package the application

    ```bash
    # allowed build targets are
    # linux-x64, win-x64, macos-x64, linux-arm64, win-arm64, macos-arm64
    npm run build && npm run package -- <YOUR_RUNNING_OS_AND_ARCHITECTURE>
    ```

1. Find the built binary in the `bin` folder

## Run local pectra devnet

You can find a kurtosis devnet specification file in the `scripts` folder in order to run a local Ethereum devnet based on devnet-4 specs (which is the same as mekong is based on).

### Requirements

1. [Install docker & kurtosis](https://docs.kurtosis.com/install)

### Start your local devnet

1. Navigate to scripts folder
    * Running the start script from outside the script folder will not work since I'm working with relative paths within the script

    ```bash
    cd scripts
    ```

1. Execute the script

    ```bash
    ./start-kurtosis-pectra-devnet-4.sh
    ```

### Mass switch withdrawal credentials

In order to test staking related functionality you need to switch validator withdrawal credentials to type 0x01. This can be done with the script `switch-withdrawal-credentials-on-kurtosis-devnet.sh`. The script needs `curl` and `staking-deposit-cli` as dependencies. Please find the latter [here](https://github.com/ethereum/staking-deposit-cli/releases), extract the binary and put it into `/usr/local/bin` (or equivalent on Mac):

The following is a recommended example call:

```bash
./switch-withdrawal-credentials-on-kurtosis-devnet.sh --beacon-node-url http://127.0.0.1:33006 --new-withdrawal-credentials 0x8943545177806ED17B9F23F0a21ee5948eCaa776 --validator_start_index 0 --validator_stop_index 100
```

Short explanation how to get the respective values:

* Beacon node connection url can be obtained from the local devnet with:

    ```bash
    kurtosis enclave inspect local-pectra-devnet-4
    # Use the ports within the 5-digit range
    # These are the ones which are exposed to your localhost 
    ```

* Validator start and stop index
    * all validators are created with the same mnemonic (see script)
    * so you can choose whatever range you like
    * However, I recommend to start from 0 for better overview
* For the new withdrawal credentials I recommend [this execution layer address](https://github.com/ethpandaops/ethereum-package/blob/1704194121ba25e1e845f210f248b9b5993d24c2/src/prelaunch_data_generator/genesis_constants/genesis_constants.star#L12) with [this private key](https://github.com/ethpandaops/ethereum-package/blob/1704194121ba25e1e845f210f248b9b5993d24c2/src/prelaunch_data_generator/genesis_constants/genesis_constants.star#L13). The private key will be necessary for sending execution layer requests with the `eth-validator-cli`.

### Inspect your testnet

The kurtosis ethereum package comes with a bunch of cool additional tools. The most important ones for you are `Dora` (Beacon chain explorer) and `Blockscout` (Execution layer explorer). Use them to check the status of transactions or how your validators behave (on consolidate, exit, etc.).

### Stop your testnet

If you want to stop your testnet just run:

```bash
kurtosis enclave stop local-pectra-devnet-4
```

## Run eth-validator-cli on local devnet

If you want to run the `eth-validator-cli` on your local devnet you can use `create_public_key_list_for_consolidation.sh` to fetch public keys for multiple validators at once. The output is a space separated list of pubkeys as the `eth-validator-cli` expects it for the e.g. `consolidate` subcommand:

```bash
./create_public_key_list_for_consolidation.sh --beacon-node-url http://127.0.0.1:33006 --validator_start_index 0 --validator_stop_index 20
```
