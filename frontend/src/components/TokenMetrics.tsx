import React from "react";
import type { TokenScanData } from "../utils/types";
import { ShieldCheck, ShieldAlert, Lock, Unlock, Key } from "lucide-react";

interface TokenMetricsProps {
  data: TokenScanData;
}

export const TokenMetrics: React.FC<TokenMetricsProps> = ({ data }) => {
  const { concentration_index, metrics } = data;
  const isHighRisk = concentration_index > 30;

  // Circle properties for circular gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (concentration_index / 100) * circumference;

  return (
    <div className="glass-panel metrics-panel">
      <div className="panel-header">
        <h3 className="glow-text-cyan">Token Security & Supply Metrics</h3>
      </div>
      
      <div className="metrics-body">
        {/* Radial Concentration Index Gauge */}
        <div className="gauge-container">
          <svg className="radial-gauge" width="160" height="160" viewBox="0 0 160 160">
            <circle
              className="gauge-bg"
              cx="80"
              cy="80"
              r={radius}
              strokeWidth="10"
            />
            <circle
              className={`gauge-fill ${isHighRisk ? "fill-danger" : "fill-success"}`}
              cx="80"
              cy="80"
              r={radius}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
              strokeLinecap="round"
            />
            <text x="80" y="75" className="gauge-value" textAnchor="middle" dominantBaseline="middle">
              {concentration_index}%
            </text>
            <text x="80" y="98" className="gauge-label" textAnchor="middle" dominantBaseline="middle">
              CONCENTRATION
            </text>
          </svg>
          <div className="gauge-caption">
            <p className="description">
              Percentage of total token supply bought within the first **1–5 blocks** of launch.
            </p>
          </div>
        </div>

        {/* Right side stats list */}
        <div className="metrics-list">
          {/* Top Holders Ratio */}
          <div className="stat-card">
            <div className="stat-label">Top 10 Holders Ratio</div>
            <div className={`stat-value ${metrics.top_10_holders_ex_liquidity > 50 ? "text-danger" : "text-success"}`}>
              {metrics.top_10_holders_ex_liquidity}%
              <span className="unit"> (Excluding Pools)</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${metrics.top_10_holders_ex_liquidity > 50 ? "bg-danger" : "bg-success"}`}
                style={{ width: `${metrics.top_10_holders_ex_liquidity}%` }}
              />
            </div>
          </div>

          {/* Dev Allocation */}
          <div className="stat-card">
            <div className="stat-label">Developer Allocations</div>
            <div className={`stat-value ${metrics.dev_supply > 10 ? "text-danger" : "text-success"}`}>
              {metrics.dev_supply}%
              <span className="unit"> (Direct Hold)</span>
            </div>
            <div className="progress-bar">
              <div 
                className={`progress-fill ${metrics.dev_supply > 10 ? "bg-danger" : "bg-success"}`}
                style={{ width: `${metrics.dev_supply * 5}%` }} // exaggerated scale for visual clarity
              />
            </div>
          </div>

          {/* Security Audits (Renounce, LP Locks, GoPlus Authorities) */}
          <div className="audits-grid" style={{ gap: "8px" }}>
            {/* Liquidity Lock / Burn */}
            <div className={`audit-badge ${metrics.lp_burned ? "audit-pass" : "audit-fail"}`} style={{ width: "100%" }}>
              {metrics.lp_burned ? (
                <>
                  <Lock size={14} />
                  <span>🔥 LP Burned ({metrics.lp_burned_pct?.toFixed(0)}%)</span>
                </>
              ) : (
                <>
                  <Unlock size={14} />
                  <span>🔓 Unlocked LP (High Rug Risk)</span>
                </>
              )}
            </div>

            {/* Mint Authority */}
            <div className={`audit-badge ${metrics.mint_authority_renounced ? "audit-pass" : "audit-fail"}`} style={{ width: "100%" }}>
              <Key size={14} />
              <span>Mint Key: {metrics.mint_authority_renounced ? "Renounced" : "⚠️ ACTIVE (Mintable)"}</span>
            </div>

            {/* Freeze Authority */}
            <div className={`audit-badge ${metrics.freeze_authority_renounced ? "audit-pass" : "audit-fail"}`} style={{ width: "100%" }}>
              <ShieldCheck size={14} />
              <span>Freeze Key: {metrics.freeze_authority_renounced ? "Renounced" : "🚨 ACTIVE (Honeypot risk)"}</span>
            </div>

            {/* Honeypot Tax */}
            <div className={`audit-badge ${(metrics.is_honeypot || (metrics.transfer_fee || 0) > 10.0) ? "audit-fail" : "audit-pass"}`} style={{ width: "100%" }}>
              <ShieldAlert size={14} />
              <span>Tax / Fee: {metrics.transfer_fee || 0}% {metrics.is_honeypot && " (🚨 HONEYPOT)"}</span>
            </div>

            {/* High early buy flag */}
            <div className={`audit-badge ${isHighRisk ? "audit-fail" : "audit-pass"}`} style={{ width: "100%" }}>
              {isHighRisk ? (
                <>
                  <ShieldAlert size={14} />
                  <span>High Block 1-5 Concentration</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Clean Launch Distribution</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
