export interface WalletCluster {
  id: string;
  label: string;
  funding_wallet: string;
  funded_wallets: string[];
  total_funding_sol: number;
  creation_date_proximity: string;
  buy_timing_proximity: string;
}

export interface TokenMetrics {
  supply_early_blocks: number;
  dev_supply: number;
  top_10_holders_ex_liquidity: number;
  liquidity_locked: boolean;
  renounced_ownership: boolean;
  mint_authority_renounced?: boolean;
  freeze_authority_renounced?: boolean;
  is_honeypot?: boolean;
  transfer_fee?: number;
  lp_burned?: boolean;
  lp_burned_pct?: number;
  dev_wallet_flagged?: boolean;
  dev_wallet_flags?: string[];
}

export interface DevHistoryItem {
  mint: string;
  name: string;
  symbol: string;
  action: "RUGGED" | "DUMPED" | "ABANDONED" | "ORGANIC_GROWTH";
  date: string;
  peak_market_cap: string;
  current_market_cap: string;
}

export interface TokenScanData {
  mint: string;
  name: string;
  symbol: string;
  dev_address: string;
  concentration_index: number;
  verdict: "HIGH COBWEB RISK" | "ORGANIC GROWTH";
  verdict_reason: string;
  risk_factors: string[];
  clusters: WalletCluster[];
  metrics: TokenMetrics;
  dev_history: DevHistoryItem[];
  agent_logs: string[];
  real_on_chain_detected?: boolean;
  real_supply?: number;
}

export interface ScanResponse {
  success: boolean;
  data: TokenScanData;
  agent_report: string;
}
