import React, { useState } from "react";
import { ArrowRight, Network, Database, Coins, Smile, Sparkles, AlertTriangle, Menu, X } from "lucide-react";

interface LandingPageProps {
  onLaunchApp: () => void;
  backendOnline?: boolean | null;
  exploits?: any[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, exploits = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="landing-page-wrapper">
      {/* Redesigned Custom Navbar */}
      <header className="landing-navbar">
        <div className="landing-logo-group">
          <img src="/logo.png" alt="CabalRadar Logo" className="landing-logo-img" />
          <span className="landing-logo-text">CabalRadar</span>
        </div>
        
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#tech">Swarms AI Engine</a>
          {exploits.length > 0 && <a href="#threats">Live Threats</a>}
          <a href="https://github.com/kyegomez/swarms" target="_blank" rel="noopener noreferrer">Swarms SDK</a>
        </nav>

        <div className="landing-nav-actions">
          <span className="swarms-count-badge">
            <span className="live-dot-green"></span>
            4 Agents Active
          </span>
          <button className="btn-launch-header" onClick={onLaunchApp}>
            Launch Radar
          </button>
        </div>

        <button className="mobile-menu-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav-menu">
          <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#tech" onClick={() => setMobileOpen(false)}>Swarms AI Engine</a>
          {exploits.length > 0 && <a href="#threats" onClick={() => setMobileOpen(false)}>Live Threats</a>}
          <a href="https://github.com/kyegomez/swarms" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Swarms SDK</a>
          
          <div className="mobile-menu-actions">
            <span className="swarms-count-badge">
              <span className="live-dot-green"></span>
              4 Agents Active
            </span>
            <button className="btn-launch-header" onClick={() => { setMobileOpen(false); onLaunchApp(); }}>
              Launch Radar
            </button>
          </div>
        </div>
      )}

      {/* Redesigned Hero Section */}
      <section className="landing-hero-redesign">
        {/* Floating colorful smiley face decorators */}
        <div className="smile-decorator smile-1"><Smile size={32} /></div>
        <div className="smile-decorator smile-2"><Smile size={24} /></div>
        <div className="smile-decorator smile-3"><Smile size={28} /></div>
        <div className="smile-decorator smile-4"><Smile size={20} /></div>
        <div className="smile-decorator smile-5"><Smile size={36} /></div>
        <div className="smile-decorator smile-6"><Smile size={24} /></div>

        <div className="hero-content-wrapper">
          <div className="hero-text-side">
            <div className="hero-badge-rainbow">
              <Sparkles size={14} className="sparkle-icon" />
              <span>SWARMS MULTI-AGENT SECURE INSIDER TRACING</span>
            </div>
            
            <h1 className="hero-title-redesign">
              We expose insider <br />
              cabals to <span className="gradient-text-rainbow">shield your trades.</span>
            </h1>
            
            <p className="hero-description-redesign">
              CabalRadar uses autonomous Swarms Multi-Agent AI to trace seed funding pathways, 
              detect Sybil wallet clusters, and audit developer reputation in real time.
            </p>
            
            <div className="hero-button-group">
              <button className="btn-hero-launch" onClick={onLaunchApp}>
                Launch Radar App <ArrowRight size={18} />
              </button>
              
              <a href="#features" className="btn-hero-learn">
                Learn More
              </a>
            </div>

            <div className="hero-trusted-by">
              <span className="trusted-title">Supported networks & frameworks</span>
              <div className="trusted-logos">
                <div className="trusted-logo">SOLANA</div>
                <div className="trusted-logo">HELIUS RPC</div>
                <div className="trusted-logo">SWARMS AI</div>
                <div className="trusted-logo">RAYDIUM</div>
              </div>
            </div>
          </div>
          
          <div className="hero-image-side">
            <div className="hero-image-container">
              <img src="/cabal_hero.png" alt="CabalRadar AI Agent" className="hero-character-artwork" />
            </div>
          </div>
        </div>

        {/* Wavy bottom divider */}
        <div className="hero-wave-divider">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="var(--bg-main)"></path>
          </svg>
        </div>
      </section>

      {/* Threats Ticker Section (immediately below Hero Divider) */}
      {exploits.length > 0 && (
        <section id="threats" className="threats-ticker-section">
          <div className="threats-ticker-container">
            <div className="threats-ticker-label">
              <AlertTriangle size={16} className="threats-icon" />
              <span>LIVE SOLANA THREATS:</span>
            </div>
            <div className="threats-ticker-flow">
              <div className="threats-ticker-scroll">
                {exploits.map((item, idx) => (
                  <span key={idx} className="threat-item">
                    🚨 <strong>{item.name}</strong> - lost <strong>${(item.fundsLost || 0).toLocaleString()}</strong> ({item.technique})
                  </span>
                ))}
                {exploits.map((item, idx) => (
                  <span key={`dup-${idx}`} className="threat-item">
                    🚨 <strong>{item.name}</strong> - lost <strong>${(item.fundsLost || 0).toLocaleString()}</strong> ({item.technique})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Landing Inner Content Container */}
      <div className="landing-inner-content">
        {/* Features Grid */}
        <section id="features" className="landing-features">
          <div className="section-header">
            <h2 className="gradient-text-purple">Three Pillars of Cabal Detection</h2>
            <p>Our autonomous agents continuously ingest block data to identify malicious coordination.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper cyan">
                <Network size={24} />
              </div>
              <h3>Sybil Wallet Clustering</h3>
              <p>
                Traces absolute genesis transactions of early buyers to see if multiple wallets share
                a common funder. Automatically maps the coordinated networks using graph visualizations.
              </p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper purple">
                <Coins size={24} />
              </div>
              <h3>Block 1-5 Concentration Index</h3>
              <p>
                Calculates the exact supply percentage swallowed by insider wallets in the initial seconds of
                liquidity pool activation. Triggers safety warnings if concentration exceeds 30%.
              </p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon-wrapper gold">
                <Database size={24} />
              </div>
              <h3>Developer Launch Audit</h3>
              <p>
                Performs recursive queries on the deployer's key history across DEXs. Flags wallets linked to
                serial launch-and-dump behaviors (rugs) to keep traders safe from repeat offenders.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Callout */}
        <section id="tech" className="tech-callout glass-panel">
          <div className="tech-content">
            <h3>Powered by Swarms AI Framework</h3>
            <p>
              Instead of a static script, CabalRadar runs a multi-agent swarm. 
              The <strong>Data Ingestion Agent</strong> handles fast JSON-RPC fetch, the <strong>Network Mapping Agent</strong> clusters addresses, 
              and the <strong>Reputation Evaluator</strong> checks historical deployers. 
              Finally, the lead <strong>CabalRadarAgent</strong> compiles the final reasoning logs and prints a readable audit report.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
