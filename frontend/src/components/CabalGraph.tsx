import React, { useEffect, useRef, useState } from "react";
import type { TokenScanData } from "../utils/types";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  type: "mint" | "dev" | "funder" | "cabal" | "holder";
  walletAddress: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface CabalGraphProps {
  data: TokenScanData;
}

export const CabalGraph: React.FC<CabalGraphProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const draggedNodeRef = useRef<Node | null>(null);

  // Initialize network elements from data
  useEffect(() => {
    if (!data) return;

    const width = 800;
    const height = 450;

    const newNodes: Node[] = [];
    const newLinks: Link[] = [];

    // 1. Center Mint Node
    newNodes.push({
      id: "mint",
      label: data.symbol,
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 20,
      color: "#00d4ff",
      glowColor: "rgba(0, 212, 255, 0.4)",
      type: "mint",
      walletAddress: data.mint,
    });

    // 2. Developer Wallet Node
    newNodes.push({
      id: "dev",
      label: "Dev Wallet",
      x: width / 2 - 120,
      y: height / 2 - 50,
      vx: 0,
      vy: 0,
      radius: 15,
      color: "#ff00ff",
      glowColor: "rgba(255, 0, 255, 0.4)",
      type: "dev",
      walletAddress: data.dev_address,
    });

    newLinks.push({ source: "dev", target: "mint", value: 1 });

    // 3. Cluster Funding Nodes and Sub-wallets
    data.clusters.forEach((cluster, cIndex) => {
      const clusterFunderId = `funder_${cIndex}`;
      
      // Funder Node
      newNodes.push({
        id: clusterFunderId,
        label: `Funding Hub ${cIndex + 1}`,
        x: width / 2 + (cIndex % 2 === 0 ? 150 : -150),
        y: height / 2 + 100,
        vx: 0,
        vy: 0,
        radius: 12,
        color: "#00d4ff",
        glowColor: "rgba(0, 212, 255, 0.4)",
        type: "funder",
        walletAddress: cluster.funding_wallet,
      });

      // Link Dev to Cluster Funder (if dev funded them)
      newLinks.push({ source: "dev", target: clusterFunderId, value: 2 });

      // Funded sub-wallets
      cluster.funded_wallets.forEach((wallet, wIndex) => {
        const walletId = `wallet_${cIndex}_${wIndex}`;
        
        newNodes.push({
          id: walletId,
          label: `Cluster Wallet ${wIndex + 1}`,
          x: width / 2 + (cIndex % 2 === 0 ? 200 : -200) + Math.cos(wIndex) * 80,
          y: height / 2 + 100 + Math.sin(wIndex) * 80,
          vx: 0,
          vy: 0,
          radius: 8,
          color: data.verdict === "HIGH COBWEB RISK" ? "#ff3366" : "#00ff88",
          glowColor: data.verdict === "HIGH COBWEB RISK" ? "rgba(255, 51, 102, 0.4)" : "rgba(0, 255, 136, 0.4)",
          type: data.verdict === "HIGH COBWEB RISK" ? "cabal" : "holder",
          walletAddress: wallet,
        });

        // Link Funder Hub to Funded Wallet
        newLinks.push({ source: clusterFunderId, target: walletId, value: 1.5 });
        // Link Funded Wallet to Token Mint (bought liquidity)
        newLinks.push({ source: walletId, target: "mint", value: 1 });
      });
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, [data]);

  // Spring physics engine
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Simulation loop
    const tick = () => {
      // 1. Spring forces between linked nodes
      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const desiredDist = link.value === 2 ? 140 : link.value === 1.5 ? 90 : 60;
        const k = 0.005; // Spring constant
        const force = (dist - desiredDist) * k;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (targetNode.id !== "mint" && targetNode !== draggedNodeRef.current) {
          targetNode.vx -= fx;
          targetNode.vy -= fy;
        }
        if (sourceNode.id !== "mint" && sourceNode !== draggedNodeRef.current) {
          sourceNode.vx += fx;
          sourceNode.vy += fy;
        }
      });

      // 2. Repulsion force between all nodes (prevent overlap)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = n1.radius + n2.radius + 40;

          if (dist < minDist) {
            const force = (minDist - dist) * 0.02;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (n2.id !== "mint" && n2 !== draggedNodeRef.current) {
              n2.vx += fx;
              n2.vy += fy;
            }
            if (n1.id !== "mint" && n1 !== draggedNodeRef.current) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
          }
        }
      }

      // 3. Central gravity (pull nodes back to center slightly)
      const gravity = 0.002;
      nodes.forEach((node) => {
        if (node.id === "mint") return;
        if (node === draggedNodeRef.current) return;

        const dx = width / 2 - node.x;
        const dy = height / 2 - node.y;
        node.vx += dx * gravity;
        node.vy += dy * gravity;

        // Apply friction
        node.vx *= 0.85;
        node.vy *= 0.85;

        // Update positions
        node.x += node.vx;
        node.y += node.vy;

        // Boundaries
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      });

      // --- Draw Scene ---
      ctx.clearRect(0, 0, width, height);

      // Background mesh grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links
      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);

        // Highlight Cabal links
        if (
          data.verdict === "HIGH COBWEB RISK" &&
          (sourceNode.type === "cabal" || targetNode.type === "cabal" || sourceNode.type === "funder")
        ) {
          ctx.strokeStyle = "rgba(255, 51, 102, 0.25)";
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Draw animated fund flow particle along links
        const timeOffset = (Date.now() / 2000) % 1;
        const px = sourceNode.x + (targetNode.x - sourceNode.x) * timeOffset;
        const py = sourceNode.y + (targetNode.y - sourceNode.y) * timeOffset;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle =
          data.verdict === "HIGH COBWEB RISK" && (sourceNode.type === "funder" || sourceNode.type === "dev")
            ? "#ff3366"
            : "#00d4ff";
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw Nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);

        // Neon Glow effect
        ctx.shadowColor = node.glowColor;
        ctx.shadowBlur = node.radius * 0.8;
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Inner circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(10, 11, 16, 0.8)";
        ctx.fill();

        // Node Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px 'Share Tech Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.label, node.x, node.y + node.radius + 4);
      });

      // Hover Card Overlay
      if (hoveredNode) {
        ctx.fillStyle = "rgba(10, 10, 15, 0.96)";
        ctx.strokeStyle = hoveredNode.color;
        ctx.lineWidth = 2;

        const cardW = 280;
        const cardH = 75;
        const cx = Math.max(10, Math.min(width - cardW - 10, hoveredNode.x - cardW / 2));
        const cy = Math.max(10, hoveredNode.y - cardH - 15);

        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(cx, cy, cardW, cardH, 8);
        } else {
          ctx.rect(cx, cy, cardW, cardH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = hoveredNode.color;
        ctx.font = "bold 12px 'Orbitron', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${hoveredNode.label} (${hoveredNode.type.toUpperCase()})`, cx + 12, cy + 12);

        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "9px 'Share Tech Mono', monospace";
        ctx.fillText("ADDR:", cx + 12, cy + 30);
        ctx.fillStyle = "#00ff88";
        ctx.font = "10px 'Fira Code', monospace";
        ctx.fillText(hoveredNode.walletAddress, cx + 45, cy + 30);

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        if (hoveredNode.type === "dev") {
          ctx.fillText("Creator of the smart contract. Traced funding chain.", cx + 12, cy + 50);
        } else if (hoveredNode.type === "cabal") {
          ctx.fillText("Coordinated insider bot. Supply bought in same block.", cx + 12, cy + 50);
        } else if (hoveredNode.type === "funder") {
          ctx.fillText("Direct funding relay. Transfers SOL before deployment.", cx + 12, cy + 50);
        } else if (hoveredNode.type === "mint") {
          ctx.fillText("Solana Token Address / DEX Liquidity Pool.", cx + 12, cy + 50);
        } else {
          ctx.fillText("Organic community buyer address.", cx + 12, cy + 50);
        }
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodes, links, hoveredNode]);

  // Drag-and-drop & hover event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = x;
      draggedNodeRef.current.y = y;
      return;
    }

    // Find node under mouse cursor
    let foundNode = null;
    for (const node of nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 10) {
        foundNode = node;
        break;
      }
    }

    setHoveredNode(foundNode);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of nodes) {
      if (node.id === "mint") continue; // Keep center pinned
      const dx = x - node.x;
      const dy = y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius + 5) {
        draggedNodeRef.current = node;
        break;
      }
    }
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
  };

  return (
    <div className="glass-panel graph-panel">
      <div className="panel-header">
        <h3 className="glow-text-cyan">Funding Flow & Wallet Cluster Graph</h3>
        <span className="badge badge-interactive">Interactive Graph</span>
      </div>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>
      <div className="graph-legend">
        <div className="legend-item"><span className="dot" style={{ backgroundColor: "#00d4ff", boxShadow: "0 0 8px #00d4ff" }} /> Token Mint</div>
        <div className="legend-item"><span className="dot" style={{ backgroundColor: "#ff00ff", boxShadow: "0 0 8px #ff00ff" }} /> Developer Wallet</div>
        <div className="legend-item"><span className="dot" style={{ backgroundColor: "#00d4ff", boxShadow: "0 0 8px #00d4ff" }} /> Funder Hub</div>
        <div className="legend-item"><span className="dot" style={{ backgroundColor: "#ff3366", boxShadow: "0 0 8px #ff3366" }} /> Cabal Bot</div>
        <div className="legend-item"><span className="dot" style={{ backgroundColor: "#00ff88", boxShadow: "0 0 8px #00ff88" }} /> Organic Holder</div>
      </div>
    </div>
  );
};
