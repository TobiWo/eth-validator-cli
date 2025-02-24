// CLI Validation constants
export const VALID_URL_PREFIXES = ['http://', 'https://'];

// Request fee calculation constants
export const MIN_CONSOLIDATION_REQUEST_FEE = 1n;
export const CONSOLIDATION_REQUEST_FEE_UPDATE_FRACTION = 17n;

// Request constants
export const NUMBER_OF_BLOCKS_FOR_LOG_LOOKUP = 50;
export const TRANSACTION_GAS_LIMIT = 200000n;
export const MAX_NUMBER_OF_REQUESTS_PER_BLOCK = 220;

// Withdrawal credential types
export const WITHDRAWAL_CREDENTIALS_0x00 = '0x00';
export const WITHDRAWAL_CREDENTIALS_0x02 = '0x02';

// Beacon api endpoints
export const VALIDATOR_STATE_BEACON_API_ENDPOINT = '/eth/v1/beacon/states/head/validators/';

// General
export const PREFIX_0x = '0x';

// system contract addresses
export const CONSOLIDATION_CONTRACT_ADDRESS = '0x0000BBdDc7CE488642fb579F8B00f3a590007251';
export const WITHDRAWAL_CONTRACT_ADDRESS = '0x00000961Ef480Eb55e80D19ad83579A64c007002';
