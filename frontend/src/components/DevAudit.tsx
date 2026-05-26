import React from "react";
import type { TokenScanData } from "../utils/types";
import { History, Skull, AlertCircle, TrendingUp, HelpCircle } from "lucide-react";

interface DevAuditProps {
  data: TokenScanData;
}

export const DevAudit: React.FC<DevAuditProps> = ({ data }) => {
  const { dev_history, dev_address } = data;

  const getActionBadge = (action: string) => {
    switch (action) {
      case "RUGGED":
        return (
          <span className="badge badge-error">
            <Skull size={12} style={{ marginRight: 4 }} />
            RUGGED (DUMPED 99%)
          </span>
        );
      case "DUMPED":
        return (
          <span className="badge badge-warn">
            <AlertCircle size={12} style={{ marginRight: 4 }} />
            INSIDER DUMP
          </span>
        );
      case "ORGANIC_GROWTH":
        return (
          <span className="badge badge-success">
            <TrendingUp size={12} style={{ marginRight: 4 }} />
            ORGANIC
          </span>
        );
      default:
        return (
          <span className="badge badge-gray">
            <HelpCircle size={12} style={{ marginRight: 4 }} />
            UNKNOWN
          </span>
        );
    }
  };

  return (
    <div className="glass-panel dev-audit-panel">
      <div className="panel-header">
        <h3 className="glow-text-cyan">Developer Behavior Audit</h3>
        <span className="address-display" title={dev_address}>
          Dev: {dev_address.slice(0, 8)}...{dev_address.slice(-8)}
        </span>
      </div>

      <div className="panel-body">
        <p className="description">
          Scanning historic deployments of this developer signature across Raydium, Pump.fun, and Moonshot.
        </p>

        {dev_history && dev_history.length > 0 && dev_history[0].mint !== "None" && dev_history[0].mint !== "NoneDetected" ? (
          <div className="timeline-container">
            {dev_history.map((project, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-dot-wrapper">
                  <div className={`timeline-dot ${project.action === "RUGGED" ? "dot-danger" : "dot-success"}`} />
                  {idx < dev_history.length - 1 && <div className="timeline-line" />}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="token-name">
                      {project.name} <span className="symbol">({project.symbol})</span>
                    </span>
                    {getActionBadge(project.action)}
                  </div>
                  
                  <div className="timeline-details">
                    <div className="detail-item">
                      <span className="label">Launch Date:</span>
                      <span className="value">{project.date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Peak MC:</span>
                      <span className="value text-cyan">{project.peak_market_cap}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Current MC:</span>
                      <span className={`value ${project.action === "RUGGED" ? "text-danger" : "text-success"}`}>
                        {project.current_market_cap}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-history-placeholder">
            <History size={36} className="text-muted" />
            <h4>Clean Developer Signature</h4>
            <p>No prior tokens launched from this address have been detected. This could be a fresh wallet or a first-time deployer.</p>
          </div>
        )}
      </div>
    </div>
  );
};
