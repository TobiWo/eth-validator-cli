export interface ConsolidationOptions {
  source: string[];
  target: string;
}

export interface GlobalCliOptions {
  network: string;
  jsonRpcUrl: string;
  beaconApiUrl: string;
  maxRequestsPerBlock: number;
}
