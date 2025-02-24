# eth-validator-cli

CLI tool for managing Ethereum validators via execution layer requests. This cli currently only supports validator related features included in the Pectra hardfork. This might change in the future. The tool is especially useful if you need to manage multiple validators at once.

Currently it only supports private keys as secret. This will change soon with e.g. hardware ledger support.

**Please find the latest [release here](https://github.com/TobiWo/eth-validator-cli/releases).**

## Supported networks

* Holesky
* Sepolia
* Mekong
* local kurtosis devnet (based on pectra devnet-6 specs)

## Features

* Consolidate one or multiple source validators to one target validator
* Switch withdrawal credentials from type 0x01 to 0x02 (compounding)

**Note: The application will request the secret e.g. the private key during runtime. You do not need to put the secret into the start command.**

**Note: Withdrawals and exits are not available yet but will be added soon.**

## Available cli options and commands

Print the help message with `--help`. This works also for every subcommand.

### Global Options

| Short Option | Long Option | Description |
| --- | --- | --- |
| -n | --network | The network name which you want to connect to |
| -r | --json-rpc-url | The json rpc endpoint which is used for sending execution layer requests |
| -b | --beacon-api-url | The beacon api endpoint which is used for sanity checks like e.g.checking withdrawal credentials |
| -m | --max-requests-per-block | The max. number of EL requests which are tried to be packaged into one block |

### Switch

| Short Option | Long Option | Description |
| --- | --- | --- |
| -v | --validator | Space separated list of validator pubkeys for which the withdrawal credential type will be changed to 0x02 |

### Consolidate

| Short Option | Long Option | Description |
| --- | --- | --- |
| -s | --source | Space separated list of validator pubkeys which will be consolidated into the target validator |
| -t | --target | Target validator pubkey |

## Usage

1. Send consolidation request

    ```bash
    ./eth-validator-cli --network <NETWORK_NAME> --json-rpc-url <CONNECTION_STRING_TO_JSON_RPC_ENDPOINT> --beacon-api-url <CONNECTION_STRING_TO_BEACON_API_ENDPOINT> consolidate --source <SPACE_SEPARATED_LIST_OF_VALIDATORS_WHICH_SHOULD_BE_CONSOLIDATED_INTO_TARGET_VALIDATOR> --target <TARGET_VALIDATOR>
    ```

1. Send request for switching withdrawal credential type

    ```bash
    ./eth-validator-cli --network <NETWORK_NAME> --json-rpc-url <CONNECTION_STRING_TO_JSON_RPC_ENDPOINT> --beacon-api-url <CONNECTION_STRING_TO_BEACON_API_ENDPOINT> switch --validator <SPACE_SEPARATED_LIST_OF_VALIDATORS_FOR_WHICH_TO_SWITCH_WITHDRAWAL_CREDENTIAL_TYPE>
    ```

## Build the application

There are currently only x64 binaries available in the release section. ARM64 will follow soon. If you want to run the application on ARM please build it by youw own.

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

You can find a kurtosis devnet specification file in the `scripts` folder in order to run a local Ethereum devnet based on pectra devnet-6 specs, which is contains the final specs for public testnets like holesky but also mainnet.

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
    ./start-kurtosis-pectra-devnet-6.sh
    ```

### Mass switch withdrawal credentials

In order to test staking related functionality you need to switch validator withdrawal credentials to type 0x01. This can be done with the script `switch-withdrawal-credentials-on-kurtosis-devnet.sh`. The script needs `curl`, `jq` and `staking-deposit-cli` as dependencies. Please find the latter [here](https://github.com/ethereum/staking-deposit-cli/releases), extract the binary and put it into `/usr/local/bin` (or equivalent on Mac):

The following is a recommended example call:

```bash
./switch-withdrawal-credentials-on-kurtosis-devnet.sh --beacon-node-url http://127.0.0.1:33006 --new-withdrawal-credentials 0x8943545177806ED17B9F23F0a21ee5948eCaa776 --validator_start_index 0 --validator_stop_index 100
```

Short explanation how to get the respective values:

* Beacon node connection url can be obtained from the local devnet with:

    ```bash
    kurtosis enclave inspect local-pectra-devnet-6
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

## Helper scripts

Helper scripts can be used on a local devnet but also on any other network.

### Create list of pubkeys for a range of validator indices

This can be used for testing the mass consolidation or mass withdrawal credential switch on a local devnet.

```bash
./create-public-key-list-for-consolidation.sh --beacon-node-url <BEACON_NODE_URL> --validator-start-index <VALIDATOR_START_INDEX> --validator-stop-index <VALIDATOR_STOP_INDEX>
```

### Get validator status for a range of validator indices

```bash
./get-validator-status.sh --beacon-node-url <BEACON_NODE_URL> --validator-start-index <VALIDATOR_START_INDEX> --validator-stop-index <VALIDATOR_STOP_INDEX>
```

### Get validator withdrawal credentials for a range of validator indices

```bash
./get-validator-withdrawal-credentials.sh --beacon-node-url <BEACON_NODE_URL> --validator-start-index <VALIDATOR_START_INDEX> --validator-stop-index <VALIDATOR_STOP_INDEX>
```
