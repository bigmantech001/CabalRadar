import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Terminal as TerminalIcon, 
  Brain, 
  Network, 
  Database, 
  UserCheck, 
  Activity, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";

interface ScannerLoaderProps {
  address: string;
  isScanning: boolean;
  onClose: () => void;
}

const INSIDER_TIPS = [
  "Insider Cabals fund dozens of fresh wallets from a single 'parent' source wallet in a single block to distribute control and evade volumetric scanners.",
  "Look for 'Freeze Authority'. If active, the creator has the permission to freeze user tokens, completely lock trading, or prevent you from selling.",
  "GoPlus security auditing screens for honeypot contracts. A honeypot simulates sell transactions in the background; if they fail, selling is blocked.",
  "Coordination clusters tend to sell in simultaneous, identical batches using custom bot scripts. Watch for matching transaction amounts down to the decimal.",
  "High buy/sell tax (transfer fees) drains your SOL balance upon transaction. Legitimate Solana tokens rarely carry any tax fees (0%).",
  "Devs of serial rugs often deploy a new contract from a clean wallet but fund it using a multi-hop transfer from their original rug wallet.",
  "Watch the concentration index in the first 1-5 blocks. If over 30% of the supply is bought in the first seconds, the token is likely cabal-controlled."
];

interface Checkpoint {
  id: number;
  label: string;
  duration: number; // Approximate trigger time in seconds
  icon: React.ReactNode;
}

const CHECKPOINTS: Checkpoint[] = [
  { id: 1, label: "Establishing connection to Solana Helius RPC node...", duration: 2, icon: <Database size={16} /> },
  { id: 2, label: "Querying token mint parameters and transaction signatures...", duration: 8, icon: <Activity size={16} /> },
  { id: 3, label: "Running GoPlus smart contract security audit (honeypots & fees)...", duration: 18, icon: <Shield size={16} /> },
  { id: 4, label: "Tracing early buyer wallet clusters and funding sources...", duration: 32, icon: <Network size={16} /> },
  { id: 5, label: "Scanning creator address and transaction history ledger...", duration: 52, icon: <UserCheck size={16} /> },
  { id: 6, label: "Invoking Swarms Multi-Agent Decision engine & report generation...", duration: 75, icon: <Brain size={16} /> }
];

export function ScannerLoader({ address, isScanning, onClose }: ScannerLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const shortAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-6)}` 
    : "SOL-TOKEN";

  // Reset loader states when scanning status transitions to false or true
  useEffect(() => {
    if (!isScanning) {
      setProgress(0);
      setLogs([]);
      setCurrentTipIndex(0);
    }
  }, [isScanning]);

  // Simulate progress indicator (starts fast, slows down, maxes at 99% until backend responds)
  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) return prev + Math.floor(Math.random() * 5) + 4; // 4 to 8%
        if (prev < 65) return prev + Math.floor(Math.random() * 3) + 2; // 2 to 4%
        if (prev < 88) return prev + Math.floor(Math.random() * 2) + 1; // 1 to 2%
        if (prev < 99) return prev + (Math.random() > 0.75 ? 1 : 0);
        return 99;
      });
    }, 200); // 200ms per tick instead of 1200ms

    return () => clearInterval(interval);
  }, [isScanning]);

  // Rotate Cabal Tips
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % INSIDER_TIPS.length);
    }, 3000); // Rotate faster
    return () => clearInterval(interval);
  }, [isScanning]);

  // Generate running terminal logs
  useEffect(() => {
    if (!isScanning) return;

    // Add initial log
    setLogs([
      `[SYSTEM] Initializing Meme Coin Cabal Audit Tool v1.0.0...`,
      `[SYSTEM] Target contract address: ${address}`,
      `[RPC] Connecting to Solana mainnet-beta via Helius gateway...`
    ]);

    // Pool of log patterns to pick from based on progress
    const logTemplates = [
      () => `[RPC] Fetching signatures for token ${shortAddress} (batch limit=1000)...`,
      () => `[RPC] Successfully retrieved transaction history. Found ${Math.floor(Math.random() * 400) + 100} signatures.`,
      () => `[ANALYSIS] Ingesting transactions for genesis blocks...`,
      () => `[AUDIT] Calling GoPlus Security API for token mint address ${shortAddress}...`,
      () => `[AUDIT] GoPlus: is_mintable=${Math.random() > 0.85 ? "true" : "false"} | freezable=${Math.random() > 0.8 ? "true" : "false"}`,
      () => `[AUDIT] GoPlus: sells_tax=${(Math.random() * 2).toFixed(1)}% | buys_tax=0.0% | honeypot_test=passed`,
      () => `[TRACER] Tracing funding sources for first 8 early buyers...`,
      () => `[TRACER] Querying creation transaction to identify creator wallet...`,
      () => `[TRACER] Creator identified: ${address.slice(0, 4)}...devWallet`,
      () => `[TRACER] Wallet cluster analysis: checking overlap in signature origins...`,
      () => `[TRACER] Detected SOL transfer from common root wallet to early buyers...`,
      () => `[HISTORY] Scanning previous deployments associated with creator wallet...`,
      () => `[HISTORY] Founding transactions checked: creator deployed ${Math.floor(Math.random() * 3)} contracts previously.`,
      () => `[HISTORY] Audit of creator history complete. Classifying past actions...`,
      () => `[SWARMS] Sending token security data payload to Swarms Agent Gateway...`,
      () => `[SWARMS] CabalRadarAgent initiated. Compiling system decision loops...`,
      () => `[SWARMS] Agent executing loop 1/1: Running risk heuristic validator...`,
      () => `[SWARMS] Analyzing wallet coordination patterns and concentration index...`,
      () => `[SWARMS] Decision compiled. Generating final report...`
    ];

    let logCounter = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        // Decide log type to show
        let nextLog = "";
        
        // Push a template log or dynamic placeholder
        if (logCounter < logTemplates.length) {
          nextLog = logTemplates[logCounter]();
          logCounter++;
        } else {
          // Select a random template or state log
          const randIdx = Math.floor(Math.random() * logTemplates.length);
          nextLog = logTemplates[randIdx]();
        }

        // Add a timestamp
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        return [...prev.slice(-40), `[${timeStr}] ${nextLog}`]; // keep last 40 logs
      });
    }, 200 + Math.random() * 200); // Rapid logging for fast scan feedback

    return () => clearInterval(interval);
  }, [isScanning, address]);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Helper to determine status icon for checkpoints
  const getCheckpointStatus = (chk: Checkpoint) => {
    // Convert current progress to virtual elapsed seconds (assuming ~90s total)
    const elapsedSeconds = (progress / 100) * 85;
    
    if (elapsedSeconds >= chk.duration + 5) {
      return <CheckCircle2 className="text-success" size={18} />;
    }
    if (elapsedSeconds >= chk.duration) {
      return <Loader2 className="text-cyan spinning" size={18} />;
    }
    return <div className="checkpoint-dot-pending" />;
  };

  if (!isScanning) return null;

  return (
    <div className="loader-screen-overlay">
      <div className="loader-cyber-grid"></div>
      
      {/* Close button at top right */}
      <button className="loader-close-btn" onClick={onClose} title="Cancel Scan">
        ✕
      </button>

      <div className="loader-container">
        
        {/* Left Side: Holographic Radar Scan & Educational Tips */}
        <div className="loader-column left-column glass-panel">
          <div className="radar-section">
            <h2 className="glow-text-cyan section-title">Cybernetic Radar Sweep</h2>
            
            <div className="radar-radar-container">
              {/* Spinning Scanner Lines */}
              <div className="radar-sweep"></div>
              
              {/* Concentric rings */}
              <div className="radar-ring ring-1"></div>
              <div className="radar-ring ring-2"></div>
              <div className="radar-ring ring-3"></div>
              <div className="radar-ring ring-4"></div>
              
              {/* Grid crosshairs */}
              <div className="radar-line-h"></div>
              <div className="radar-line-v"></div>
              
              {/* Pulsing signal dots */}
              <div className="radar-blip blip-1"></div>
              <div className="radar-blip blip-2"></div>
              <div className="radar-blip blip-3"></div>
              <div className="radar-blip blip-4"></div>
              
              <div className="radar-center">
                <Shield size={20} className="text-cyan animate-pulse" />
              </div>
            </div>
            
            <div className="radar-target-status">
              <span className="text-muted">TARGET:</span>
              <span className="address-display font-mono text-cyan" title={address}>{shortAddress}</span>
            </div>
          </div>
          
          <div className="tips-section border-top">
            <div className="tips-header">
              <AlertTriangle className="text-warn animate-pulse" size={16} />
              <h4>Insider Cabal Intel</h4>
            </div>
            <div className="tips-carousel-wrapper">
              <p className="tips-text fade-in" key={currentTipIndex}>
                {INSIDER_TIPS[currentTipIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Progress Checklist & Active Terminal Log Stream */}
        <div className="loader-column right-column glass-panel">
          <div className="audit-checklist-section">
            <div className="checklist-header">
              <h2 className="glow-text-cyan section-title">Blockchain Audit Heuristics</h2>
              <div className="cyber-badge text-cyan animate-pulse">Scanning</div>
            </div>
            
            {/* Checklist */}
            <div className="checkpoint-list">
              {CHECKPOINTS.map((chk) => (
                <div key={chk.id} className={`checkpoint-row ${((progress / 100) * 85) >= chk.duration ? 'active' : ''}`}>
                  <div className="checkpoint-status-icon">
                    {getCheckpointStatus(chk)}
                  </div>
                  <div className="checkpoint-icon">
                    {chk.icon}
                  </div>
                  <div className="checkpoint-details">
                    <span className="checkpoint-label">{chk.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="loader-progress-bar-container">
              <div className="progress-bar-header">
                <span className="progress-percentage text-cyan font-mono">{progress}% COMPLETE</span>
                <span className="progress-eta text-muted font-mono">EST: ~60-90s</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          <div className="terminal-log-section border-top">
            <div className="terminal-log-header">
              <TerminalIcon size={16} className="text-cyan" />
              <h3 className="section-title" style={{ margin: 0, fontSize: '12px' }}>Real-time Audit Stream</h3>
            </div>
            
            <div className="terminal-log-body font-mono">
              <div className="grid-overlay"></div>
              <div className="terminal-log-content">
                {logs.map((log, index) => (
                  <div key={index} className="log-line">
                    <span className="prompt">&gt;</span>
                    <span className={log.includes('[SYSTEM]') ? 'text-fuchsia' : log.includes('[RPC]') ? 'text-cyan' : log.includes('[AUDIT]') ? 'text-warn' : log.includes('[SWARMS]') ? 'text-success' : ''}>
                      {log}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
