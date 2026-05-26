import React, { useEffect, useState, useRef } from "react";
import { Terminal, RefreshCw, Cpu, Activity } from "lucide-react";

// Simple custom Markdown rendering utilities
const parseInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code 
          key={index} 
          style={{ 
            background: "rgba(255,255,255,0.08)", 
            padding: "2px 6px", 
            borderRadius: "4px", 
            fontFamily: "var(--font-mono)", 
            fontSize: "11px", 
            color: "var(--color-pink)" 
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    
    // Headers
    if (trimmed.startsWith("### ")) {
      return (
        <h4 key={idx} className="report-h4 text-cyan" style={{ marginTop: 18, marginBottom: 8, fontSize: "14px", fontWeight: "bold" }}>
          {parseInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
    }
    if (trimmed.startsWith("## ")) {
      return (
        <h3 key={idx} className="report-h3 text-cyan" style={{ marginTop: 22, marginBottom: 10, fontSize: "16px", fontWeight: "bold" }}>
          {parseInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
    }
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={idx} className="report-h2 text-cyan" style={{ marginTop: 26, marginBottom: 12, fontSize: "18px", fontWeight: "bold" }}>
          {parseInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
    }
    
    // Unordered Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <li key={idx} className="report-li" style={{ marginLeft: 16, marginBottom: 6, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.85)" }}>
          {parseInlineMarkdown(trimmed.substring(2))}
        </li>
      );
    }
    
    // Ordered Lists
    const orderedListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (orderedListMatch) {
      return (
        <div key={idx} className="report-ol-item" style={{ marginLeft: 12, marginBottom: 6, fontSize: "12.5px", color: "rgba(255, 255, 255, 0.85)" }}>
          <strong className="text-cyan" style={{ marginRight: 6 }}>{orderedListMatch[1]}.</strong>
          {parseInlineMarkdown(orderedListMatch[2])}
        </div>
      );
    }
    
    // Blank line
    if (trimmed === "") {
      return <div key={idx} style={{ height: 8 }} />;
    }
    
    // Default Paragraph
    return (
      <p key={idx} className="report-p" style={{ marginBottom: 10, fontSize: "12.5px", lineHeight: "1.6", color: "rgba(255, 255, 255, 0.85)" }}>
        {parseInlineMarkdown(line)}
      </p>
    );
  });
};

interface AgentTerminalProps {
  logs?: string[];
  report?: string;
  isScanning: boolean;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs = [], report = "", isScanning }) => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLogs, showReport, isScanning]);

  // Handle typing simulation
  useEffect(() => {
    if (isScanning) {
      setVisibleLogs(["[System] Connecting to Swarms Multi-Agent cluster...", "[System] Spawning CabalRadarAgent..."]);
      setShowReport(false);
      return;
    }

    const logsArray = Array.isArray(logs) ? logs : [];
    if (logsArray.length === 0) {
      setVisibleLogs(["[System] No logs received from Swarms agent."]);
      setShowReport(true);
      return;
    }

    setVisibleLogs([logsArray[0]]);
    setShowReport(false);

    let logIdx = 1;
    const interval = setInterval(() => {
      if (logIdx < logsArray.length) {
        setVisibleLogs((prev) => [...prev, logsArray[logIdx]]);
        logIdx++;
      } else {
        clearInterval(interval);
        setShowReport(true);
      }
    }, 450); // Speed of typewriter console

    return () => clearInterval(interval);
  }, [logs, isScanning]);

  return (
    <div className="glass-panel terminal-panel">
      <div className="panel-header">
        <div className="header-left">
          <Terminal size={16} className="text-cyan animate-pulse" />
          <h3 className="glow-text-cyan">Swarms AI Agent Core Logs</h3>
        </div>
        <div className="header-right">
          {isScanning ? (
            <span className="terminal-status text-cyan animate-pulse">
              <RefreshCw size={12} className="spinning" /> AGENT ACTIVE
            </span>
          ) : showReport ? (
            <span className="terminal-status text-success">
              <Activity size={12} /> SCAN DONE
            </span>
          ) : (
            <span className="terminal-status text-warn">
              <Cpu size={12} /> COMPUTING LOGS
            </span>
          )}
        </div>
      </div>

      <div className="terminal-body">
        {/* Animated grid overlay */}
        <div className="grid-overlay" />

        <div className="terminal-content">
          {visibleLogs.map((log, idx) => {
            if (typeof log !== "string") return null;
            
            const isWarning = log.includes("WARNING") || log.includes("CRITICAL") || log.includes("Danger") || log.includes("MATCH FOUND") || log.includes("Rug");
            const isSystem = log.includes("[System]");
            const isTool = log.includes("[Tool:");
            
            let logClass = "log-line";
            if (isWarning) logClass += " text-danger";
            else if (isSystem) logClass += " text-muted";
            else if (isTool) logClass += " text-fuchsia";
            else logClass += " text-cyan";

            return (
              <div key={idx} className={logClass}>
                <span className="prompt">&gt;</span> {log}
              </div>
            );
          })}

          {isScanning && (
            <div className="log-line text-cyan animate-pulse">
              <span className="prompt">&gt;</span> [Agent] Listening for Solana blockchain RPC signatures...
            </div>
          )}

          {showReport && (
            <div className="agent-report-container fade-in">
              <div className="divider" />
              <div className="report-markdown" style={{ whiteSpace: "normal" }}>
                <h3 style={{ color: "var(--color-gold)", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginBottom: 16 }}>
                  SWARMS DECISION AGENT REPORT
                </h3>
                <div className="report-body" style={{ padding: "4px 8px" }}>
                  {renderMarkdown(report)}
                </div>
              </div>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
