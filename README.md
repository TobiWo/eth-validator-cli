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

You can find the built binary in the `bin` folder after running the below commands.

```bash
npm run build && npm run package
```
