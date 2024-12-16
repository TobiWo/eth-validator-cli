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
