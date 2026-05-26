import React from "react";
import type { TokenScanData } from "../utils/types";
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";

interface VerdictPanelProps {
  data: TokenScanData;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ data }) => {
  const { verdict, verdict_reason, risk_factors, concentration_index, dev_history, clusters } = data;
  const isHighRisk = verdict === "HIGH COBWEB RISK";

  return (
    <div className={`glass-panel verdict-panel ${isHighRisk ? "verdict-danger-panel" : "verdict-success-panel"}`}>
      <div className="verdict-banner">
        <div className="verdict-icon-container">
          {isHighRisk ? (
            <AlertOctagon size={48} className="icon-pulse text-danger" />
          ) : (
            <ShieldCheck size={48} className="icon-glow text-success" />
          )}
        </div>
        <div className="verdict-meta">
          <span className="subtitle">SWARMS SECURITY AUDIT</span>
          <h2 className={`verdict-title ${isHighRisk ? "glow-text-danger" : "glow-text-success"}`}>
            {verdict}
          </h2>
        </div>
      </div>

      <div className="verdict-content">
        <p className="verdict-reason">
          {verdict_reason}
        </p>

        {data.metrics?.dev_wallet_flagged && (
          <div className="dev-flagged-warning-banner" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <AlertOctagon size={20} className="icon-pulse text-danger" style={{ marginTop: "2px" }} />
              <div>
                <strong style={{ color: "var(--color-pink)", fontSize: "13px" }}>🚨 SECURITY ALERT: Developer Address Blacklisted!</strong>
                <p style={{ fontSize: "11px", margin: "4px 0 0 0", color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.4 }}>
                  GoPlus intelligence detected malicious flags: <br />
                  <span className="text-cyan" style={{ fontWeight: 600 }}>{data.metrics.dev_wallet_flags?.join(", ")}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <h4 className="section-title">Coordinated Risk Matrix</h4>
        <div className="risk-checker">
          {/* Check 1: Concentration Index */}
          <div className="risk-check-item">
            <span className="icon-wrapper">
              {concentration_index > 30 ? (
                <AlertTriangle size={16} className="text-danger" />
              ) : (
                <CheckCircle2 size={16} className="text-success" />
              )}
            </span>
            <div className="risk-text">
              <span className="title">Supply Concentration Index</span>
              <span className="desc">
                {concentration_index > 30 
                  ? `Danger! Early buyers hold ${concentration_index}% of supply (limit 30%).` 
                  : `Safe. Early buyer absorption is limited to ${concentration_index}% of supply.`
                }
              </span>
            </div>
          </div>

          {/* Check 2: Coordinated Wallets */}
          <div className="risk-check-item">
            <span className="icon-wrapper">
              {clusters.length > 0 && isHighRisk ? (
                <AlertTriangle size={16} className="text-danger" />
              ) : (
                <CheckCircle2 size={16} className="text-success" />
              )}
            </span>
            <div className="risk-text">
              <span className="title">Wallet Clustering & Funding Linkage</span>
              <span className="desc">
                {clusters.length > 0 && isHighRisk
                  ? `Coordinated wallets detected funding each other within blocks of launch.`
                  : "No clustered funding circles detected. Wallets withdrew independently."
                }
              </span>
            </div>
          </div>

          {/* Check 3: Dev History */}
          <div className="risk-check-item">
            <span className="icon-wrapper">
              {dev_history && dev_history.length > 0 && dev_history[0].action === "RUGGED" ? (
                <AlertTriangle size={16} className="text-danger" />
              ) : (
                <CheckCircle2 size={16} className="text-success" />
              )}
            </span>
            <div className="risk-text">
              <span className="title">Developer Launch Reputation</span>
              <span className="desc">
                {dev_history && dev_history.length > 0 && dev_history[0].action === "RUGGED"
                  ? "Developer address is linked directly to serial rug-pull history."
                  : "Deployer signature has a clean launch audit history."
                }
              </span>
            </div>
          </div>
        </div>

        {risk_factors && risk_factors.length > 0 && (
          <div className="risk-factors-list">
            <h4 className="section-title">Identified Risk Triggers</h4>
            <ul>
              {risk_factors.map((factor, idx) => (
                <li key={idx}>
                  <span className="bullet">•</span> {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
