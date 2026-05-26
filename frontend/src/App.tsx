import { useState, useEffect, useRef } from "react";
import { Search, Shield, RefreshCw, Menu, X } from "lucide-react";
import { VerdictPanel } from "./components/VerdictPanel";
import { CabalGraph } from "./components/CabalGraph";
import { TokenMetrics } from "./components/TokenMetrics";
import { DevAudit } from "./components/DevAudit";
import { AgentTerminal } from "./components/AgentTerminal";
import { LandingPage } from "./components/LandingPage";
import { ScannerLoader } from "./components/ScannerLoader";
import type { TokenScanData, ScanResponse } from "./utils/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function App() {
  const [viewState, setViewState] = useState<"landing" | "app">("landing");
  const [address, setAddress] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<TokenScanData | null>(null);
  const [agentReport, setAgentReport] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [exploits, setExploits] = useState<any[]>([]);
  
  const scanActiveRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        setBackendOnline(response.ok);
      } catch (e) {
        setBackendOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchExploits = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/exploits`);
        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            setExploits(resData.exploits || []);
          }
        }
      } catch (e) {
        console.error("Failed to fetch exploits ticker:", e);
      }
    };

    fetchExploits();
    const interval = setInterval(fetchExploits, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, []);

  const handleScan = async (targetAddress: string) => {
    if (!targetAddress || targetAddress.length < 32) {
      setErrorMessage("Please enter a valid Solana contract address (min 32 chars).");
      return;
    }
    
    setViewState("app");
    setErrorMessage("");
    setIsScanning(true);
    scanActiveRef.current = true;

    try {
      // Query FastAPI backend
      const response = await fetch(`${API_BASE_URL}/api/scan?address=${targetAddress}`);
      if (response.ok) {
        const result: ScanResponse = await response.json();
        setTimeout(() => {
          if (!scanActiveRef.current) return; // Discard result if user closed/cancelled the scan
          setScanResult(result.data);
          setAgentReport(result.agent_report);
          setIsScanning(false);
        }, 600);
        return;
      }
      throw new Error("Backend returned status code: " + response.status);
    } catch (e) {
      console.error("Scan failed:", e);
      setTimeout(() => {
        if (!scanActiveRef.current) return;
        setErrorMessage("Failed to run on-chain scan: Backend server is offline or returned an error.");
        setIsScanning(false);
      }, 600);
    }
  };

  const handleReset = () => {
    setAddress("");
    setScanResult(null);
    setAgentReport("");
    setErrorMessage("");
  };

  return (
    <div className={viewState === "landing" ? "landing-page-root" : "app-container"}>
      {/* Loading overlay for the agent analysis phase */}
      {isScanning && (
        <ScannerLoader 
          address={address} 
          isScanning={isScanning} 
          onClose={() => {
            scanActiveRef.current = false;
            setIsScanning(false);
          }} 
        />
      )}

      {/* Header */}
      {viewState !== "landing" && (
        <>
          <header>
            <div className="brand-wrapper" style={{ cursor: "pointer" }} onClick={() => setViewState("landing")}>
              <div className="brand-logo" style={{ background: "none", boxShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/logo.png" alt="CabalRadar Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
              </div>
              <div className="brand-name">
                <h1>CabalRadar</h1>
                <p>Swarms Insider Wallet Tracker</p>
              </div>
            </div>

            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="header-status">
              <span className="badge badge-interactive" style={{ marginRight: 4 }}>
                🤖 4 Swarms Agents Active
              </span>
              {backendOnline !== null && (
                <span className={`badge ${backendOnline ? "badge-success" : "badge-error"}`}>
                  Backend: {backendOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>
          </header>

          {mobileMenuOpen && (
            <div className="mobile-app-nav-menu">
              <span className="badge badge-interactive" style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}>
                🤖 4 Swarms Agents Active
              </span>
              {backendOnline !== null && (
                <span className={`badge ${backendOnline ? "badge-success" : "badge-error"}`} style={{ width: "100%", justifyContent: "center" }}>
                  Backend: {backendOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>
          )}
        </>
      )}

      {/* Live Solana Exploit Ticker */}
      {viewState !== "landing" && exploits.length > 0 && (
        <div className="exploit-ticker-bar animate-pulse-border">
          <div className="ticker-label">
            <span className="live-dot"></span>
            LIVE SOLANA THREATS:
          </div>
          <div className="ticker-marquee">
            <div className="ticker-scroll">
              {exploits.map((item, idx) => (
                <span key={idx} className="ticker-item">
                  🚨 <strong>{item.name}</strong> - lost <strong>${(item.fundsLost || 0).toLocaleString()}</strong> ({item.technique})
                </span>
              ))}
              {exploits.map((item, idx) => (
                <span key={`dup-${idx}`} className="ticker-item">
                  🚨 <strong>{item.name}</strong> - lost <strong>${(item.fundsLost || 0).toLocaleString()}</strong> ({item.technique})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewState === "landing" ? (
        <LandingPage 
          onLaunchApp={() => setViewState("app")} 
          backendOnline={backendOnline} 
          exploits={exploits} 
        />
      ) : (
        <>
          {/* Search Input Bar */}
          <div className="glass-panel search-panel">
            <form
              id="cabal-scan-form"
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleScan(address);
              }}
            >
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  id="cabal-token-address-input"
                  className="search-input"
                  value={address}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length < address.length) {
                      // Character deleted: clear results
                      setScanResult(null);
                      setAgentReport("");
                    }
                    setAddress(newValue);
                  }}
                  placeholder="Enter Solana token mint address..."
                />
              </div>
              <button 
                type="submit" 
                id="cabal-scan-submit-button" 
                className="btn-scan" 
                disabled={isScanning || backendOnline !== true}
                title={backendOnline !== true ? "Backend is offline. Cannot run scans." : ""}
              >
                {isScanning ? (
                  <>
                    <RefreshCw size={18} className="spinning" /> Scanning...
                  </>
                ) : (
                  <>
                    <Search size={18} /> Run Cabal Audit
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn-reset" 
                onClick={handleReset} 
                disabled={isScanning || (!address && !scanResult)}
              >
                Reset
              </button>
            </form>

            {errorMessage && <p className="error-text text-danger" style={{ marginTop: 12, fontSize: 13 }}>{errorMessage}</p>}
          </div>

          {/* Main Analysis Display */}
          {scanResult && !isScanning ? (
            <div className="dashboard-grid">
              {/* Column Left: Visual Network Graph and Console Logs */}
              <div className="grid-column">
                <CabalGraph data={scanResult} />
                <AgentTerminal logs={scanResult.agent_logs} report={agentReport} isScanning={isScanning} />
              </div>

              {/* Column Right: Security Verdict, Gauge metrics, and Dev audit */}
              <div className="grid-column">
                <VerdictPanel data={scanResult} />
                <TokenMetrics data={scanResult} />
                <DevAudit data={scanResult} />
              </div>
            </div>
          ) : (
            !isScanning && (
              <div className="glass-panel empty-scan-placeholder" style={{ padding: "40px 20px", textAlign: "center", marginTop: "24px", position: "relative", overflow: "hidden" }}>
                <div className="hero-glow-cyan" style={{ top: "30%", left: "40%", width: "200px", height: "200px", opacity: 0.5 }}></div>
                <Shield size={36} className="text-cyan animate-pulse" style={{ margin: "0 auto 16px auto", opacity: 0.8 }} />
                <h3 className="glow-text-cyan" style={{ fontFamily: "var(--font-display)", fontSize: "14px", marginBottom: "8px" }}>Ready to Scan Solana Mint Address</h3>
                <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", maxWidth: "460px", margin: "0 auto 16px auto", lineHeight: 1.5 }}>
                  Enter a Solana token contract address in the input above and click <strong>"Run Cabal Audit"</strong> to start analyzing coordinated insider activity.
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}


