export interface ValidatorOption {
  validator: string[];
}

export interface ConsolidationOptions {
  source: string[];
  target: string;
}

export interface WithdrawOptions extends ValidatorOption {
  amount: number;
}

export interface GlobalCliOptions {
  network: string;
  jsonRpcUrl: string;
  beaconApiUrl: string;
  maxRequestsPerBlock: number;
}
