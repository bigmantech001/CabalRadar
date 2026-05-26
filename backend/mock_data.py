import random
import time

# Pre-packaged tokens for immediate sandbox demonstration
WIF_ADDRESS = "EKpQGSJtjMFqKZ9KQGWjh65KUuuxg4sP8ae86k26Fpump"
BONK_ADDRESS = "DezXAZ8z7PnrFcPykJ47t5MiC6L3uH34pT62tA7b67bU"
COBWEB_RUG_ADDRESS = "C0bWebRuG1111111111111111111111111111111111"
MOONSHOT_ADDRESS = "MoonsHoT22222222222222222222222222222222222"

MOCK_DATABASE = {
    WIF_ADDRESS: {
        "mint": WIF_ADDRESS,
        "name": "dogwifhat",
        "symbol": "WIF",
        "dev_address": "WifDev111111111111111111111111111111111111",
        "concentration_index": 12.4,
        "verdict": "ORGANIC GROWTH",
        "verdict_reason": "Low initial buyer concentration, diverse funding sources, and liquidity is deeply locked/burned. No coordinated wallet clusters found in early launch blocks.",
        "risk_factors": [
            "Top 10 holders own less than 15% of supply.",
            "Initial liquidity pool was burned.",
            "Developer wallet has no history of serial launches or rugs."
        ],
        "clusters": [
            {
                "id": "c1",
                "label": "Early Commnity Cluster",
                "funding_wallet": "BinanceSolFunder1111111111111111111111111",
                "funded_wallets": [
                    "WifHolderA1111111111111111111111111111",
                    "WifHolderB2222222222222222222222222222",
                    "WifHolderC3333333333333333333333333333"
                ],
                "total_funding_sol": 1500.0,
                "creation_date_proximity": "Varying creation dates (months apart)",
                "buy_timing_proximity": "Bought over several hours post-launch"
            }
        ],
        "metrics": {
            "supply_early_blocks": 4.2,
            "dev_supply": 0.0,
            "top_10_holders_ex_liquidity": 11.2,
            "liquidity_locked": True,
            "renounced_ownership": True
        },
        "dev_history": [
            {
                "mint": "NoneDetected",
                "name": "No prior tokens detected",
                "symbol": "N/A",
                "action": "ORGANIC_GROWTH",
                "date": "2023-11-20",
                "peak_market_cap": "$0",
                "current_market_cap": "$0"
            }
        ],
        "agent_logs": [
            "[Swarms Agent: CabalRadar] Fetching signatures for dogwifhat (WIF)...",
            "[Tool: get_signatures] Retreived 1,200 txs for early launch blocks.",
            "[Swarms Agent: CabalRadar] Tracing genesis transactions. LP was seeded and burned.",
            "[Tool: cluster_funding_sources] Executing multi-hop wallet clustering...",
            "[Swarms Agent: CabalRadar] Checked 45 early buyer wallets. No single wallet funded multiple buyer addresses directly. Distribution matches standard exchange withdrawals.",
            "[Swarms Agent: CabalRadar] Running Dev Behavior Audit...",
            "[Swarms Agent: CabalRadar] Dev address WifDev111... has 0 prior launches. Clean slate.",
            "[Swarms Agent: CabalRadar] Supply Concentration index in block 1-5 is 12.4%. Safe threshold is < 30%.",
            "[Swarms Agent: CabalRadar] Analysis completed. Final Verdict: ORGANIC GROWTH."
        ]
    },
    BONK_ADDRESS: {
        "mint": BONK_ADDRESS,
        "name": "Bonk",
        "symbol": "BONK",
        "dev_address": "BonkDev11111111111111111111111111111111111",
        "concentration_index": 18.2,
        "verdict": "ORGANIC GROWTH",
        "verdict_reason": "Distributed via massive, transparent airdrop. Wide initial distribution and no signs of malicious wallet spoofing.",
        "risk_factors": [
            "Early supply highly distributed across ecosystem participants.",
            "Development team is public/semi-public.",
            "High percentage of liquidity locked across multiple Solana DEXs."
        ],
        "clusters": [
            {
                "id": "c1",
                "label": "Ecosystem Multi-sig Funding",
                "funding_wallet": "BonkMultiSig111111111111111111111111111",
                "funded_wallets": [
                    "BonkHolderA111111111111111111111111111",
                    "BonkHolderB222222222222222222222222222",
                    "BonkHolderC333333333333333333333333333"
                ],
                "total_funding_sol": 5000.0,
                "creation_date_proximity": "Created at different times",
                "buy_timing_proximity": "Distributed via transparent airdrop script"
            }
        ],
        "metrics": {
            "supply_early_blocks": 5.5,
            "dev_supply": 2.1,
            "top_10_holders_ex_liquidity": 9.4,
            "liquidity_locked": True,
            "renounced_ownership": True
        },
        "dev_history": [
            {
                "mint": "EcosystemLaunch",
                "name": "Solana Christmas Airdrop",
                "symbol": "XMAS",
                "action": "ORGANIC_GROWTH",
                "date": "2022-12-25",
                "peak_market_cap": "$2.5B",
                "current_market_cap": "$1.8B"
            }
        ],
        "agent_logs": [
            "[Swarms Agent: CabalRadar] Fetching logs for BONK...",
            "[Tool: get_signatures] Checked launch events and genesis distribution.",
            "[Swarms Agent: CabalRadar] Token distributed via cross-program helper. Initial liquidity added organically.",
            "[Tool: cluster_funding_sources] Wallet clustering detected zero coordinated insider buying blocks.",
            "[Swarms Agent: CabalRadar] Dev audit: associated with reputable Solana builder nodes.",
            "[Swarms Agent: CabalRadar] Output: Safe and organic token profile verified."
        ]
    },
    COBWEB_RUG_ADDRESS: {
        "mint": COBWEB_RUG_ADDRESS,
        "name": "Cabal Gold Sol",
        "symbol": "COBWEB",
        "dev_address": "RugDevMaster3333333333333333333333333333",
        "concentration_index": 82.7,
        "verdict": "HIGH COBWEB RISK",
        "verdict_reason": "High early buyer concentration. The developer wallet funded 8 separate sub-wallets 5 minutes before launch, which bought up 82.7% of the supply in the exact same block. This is a classic cabal liquidity-suck formation.",
        "risk_factors": [
            "Dev funded 8 sub-wallets in a daisy-chain (A -> B -> C/D/E) within 2 blocks.",
            "Concentration Index is 82.7% (Extremely High risk).",
            "Developer has 3 prior launches that ended in 100% dumps within 15 minutes."
        ],
        "clusters": [
            {
                "id": "c1",
                "label": "Dev Funding Chain (Cabal Cluster)",
                "funding_wallet": "RugDevMaster3333333333333333333333333333",
                "funded_wallets": [
                    "CabalWalletA11111111111111111111111111",
                    "CabalWalletB22222222222222222222222222",
                    "CabalWalletC33333333333333333333333333",
                    "CabalWalletD44444444444444444444444444"
                ],
                "total_funding_sol": 120.0,
                "creation_date_proximity": "All created within 5 minutes of launch",
                "buy_timing_proximity": "Coordinated buys within Block #25442111 (0.5s after LP add)"
            }
        ],
        "metrics": {
            "supply_early_blocks": 82.7,
            "dev_supply": 12.0,
            "top_10_holders_ex_liquidity": 94.5,
            "liquidity_locked": False,
            "renounced_ownership": False
        },
        "dev_history": [
            {
                "mint": "RuggedCoinA11111111111111111111111111111",
                "name": "Cat Rocket Sol",
                "symbol": "CATROCKET",
                "action": "RUGGED",
                "date": "2026-05-10",
                "peak_market_cap": "$120,000",
                "current_market_cap": "$450"
            },
            {
                "mint": "RuggedCoinB22222222222222222222222222222",
                "name": "Pepe Moon Sol",
                "symbol": "PEPEMOON",
                "action": "RUGGED",
                "date": "2026-05-18",
                "peak_market_cap": "$85,000",
                "current_market_cap": "$120"
            }
        ],
        "agent_logs": [
            "[Swarms Agent: CabalRadar] WARNING: Flagging Token Address C0bWebRuG...",
            "[Swarms Agent: CabalRadar] Fetching signatures. Found creation tx by RugDevMaster333...",
            "[Tool: cluster_funding_sources] Executing multi-hop cluster traceback...",
            "[Swarms Agent: CabalRadar] CRITICAL MATCH: Funding master address RugDevMaster333 sent 30 SOL each to 4 freshly created wallets (CabalWalletA, B, C, D) in transaction signature 4k9gP...",
            "[Swarms Agent: CabalRadar] Analyzing Block 25442111 (Genesis LP Add). The 4 funded wallets bought 82.7% of total supply within 1.2 seconds of Raydium pool creation.",
            "[Tool: dev_launch_audit] Auditing prior launch history of RugDevMaster333...",
            "[Swarms Agent: CabalRadar] MATCH FOUND: Dev address launched 'Cat Rocket Sol' and 'Pepe Moon Sol'. Both projects experienced 99.8% value drops within 15 minutes of dev selling. Action flagged: SERIAL RUGGER.",
            "[Swarms Agent: CabalRadar] Supply concentration index (82.7%) exceeds safety boundary (30%).",
            "[Swarms Agent: CabalRadar] Security Alert: Cabal control confirmed. Raising HIGH COBWEB RISK verdict."
        ]
    }
}

def generate_procedural_scan(address: str) -> dict:
    """
    Generates a realistic Solana cabal analysis procedurally for any address
    to ensure full testing capabilities without needing real-world Helius keys.
    """
    # Check if we have pre-packaged data
    if address in MOCK_DATABASE:
        return MOCK_DATABASE[address]
        
    # Standard deterministic generation based on address hash
    seed = sum(ord(c) for c in address)
    random.seed(seed)
    
    # Decide if high risk (cabal-controlled) or organic
    is_high_risk = (seed % 2 == 0)
    
    symbol_opts = ["SHIB", "PUMP", "DOGE", "APE", "MEME", "SOL", "PEPE", "FLOKI", "MOON", "CABAL", "NEON", "GLOW"]
    prefix_opts = ["Super", "Cyber", "Mega", "Degen", "Alpha", "Safe", "Risk", "Hyper", "Golden", "Quant"]
    
    symbol = f"{random.choice(prefix_opts)[:3].upper()}{random.choice(symbol_opts)}"
    name = f"{random.choice(prefix_opts)} {random.choice(symbol_opts).capitalize()}"
    
    dev_address = f"Dev{address[3:10]}Wallet" + "".join(random.choices("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", k=20))
    
    if is_high_risk:
        concentration = round(random.uniform(55.0, 95.0), 1)
        verdict = "HIGH COBWEB RISK"
        verdict_reason = f"Highly coordinated cluster of early buyers detected. {random.randint(4, 9)} wallets funded from a single master wallet acquired {concentration}% of the supply in the first 2 blocks."
        
        risk_factors = [
            f"Early concentration index is {concentration}%, indicating extreme supply monopoly.",
            "Multiple wallets funded by a single master address within 10 minutes of launch.",
            f"Developer wallet {dev_address[:8]}... has rug history on previous deployments."
        ]
        
        # Create a funding cluster
        cluster_wallets = [f"CabalHolder_{i}_{address[5:9]}" for i in range(1, 6)]
        clusters = [
            {
                "id": "c1",
                "label": "Coordinated Insider Cluster",
                "funding_wallet": dev_address,
                "funded_wallets": cluster_wallets,
                "total_funding_sol": round(random.uniform(50.0, 300.0), 1),
                "creation_date_proximity": "All created within 10 minutes of deploy",
                "buy_timing_proximity": f"Buys executed in block #{random.randint(1000, 2000)} (same transaction bundle)"
            }
        ]
        
        metrics = {
            "supply_early_blocks": concentration,
            "dev_supply": round(random.uniform(5.0, 20.0), 1),
            "top_10_holders_ex_liquidity": round(random.uniform(75.0, 99.0), 1),
            "liquidity_locked": False,
            "renounced_ownership": False
        }
        
        dev_history = [
            {
                "mint": f"PriorRug{i}MintAddress" + "x" * 20,
                "name": f"Rugged Token {i}",
                "symbol": f"RUG{i}",
                "action": "RUGGED",
                "date": f"2026-05-{random.randint(1, 20):02d}",
                "peak_market_cap": f"${random.randint(50, 150):,},000",
                "current_market_cap": f"${random.randint(100, 900)}"
            } for i in range(1, random.randint(2, 4))
        ]
        
        agent_logs = [
            f"[Swarms Agent: CabalRadar] Initiating scan for token: {name} ({symbol})",
            "[Tool: get_signatures] Retreived early launch block signatures.",
            "[Swarms Agent: CabalRadar] Tracing funding flow...",
            f"[Swarms Agent: CabalRadar] Detected central funding point at {dev_address[:10]}...",
            f"[Tool: cluster_funding_sources] Grouped {len(cluster_wallets)} wallets into Cluster #1.",
            f"[Swarms Agent: CabalRadar] Found coordinated buyer transaction block. Concentration is {concentration}%.",
            f"[Tool: dev_launch_audit] Audited Dev address {dev_address[:10]}... found {len(dev_history)} serial rug instances.",
            "[Swarms Agent: CabalRadar] Safety triggers breached. High rug risk detected.",
            "[Swarms Agent: CabalRadar] Verdict: HIGH COBWEB RISK."
        ]
        
    else:
        concentration = round(random.uniform(5.0, 28.0), 1)
        verdict = "ORGANIC GROWTH"
        verdict_reason = f"Excellent supply distribution. No multi-wallet clusters detected, and early block purchases account for only {concentration}% of total supply. Dev history is clear."
        
        risk_factors = [
            f"Supply concentration index is {concentration}% (within safe limit of < 30%).",
            "No coordinated wallet funding trails found from the deployer wallet.",
            "Token ownership is renounced, preventing code-based minting exploits."
        ]
        
        clusters = [
            {
                "id": "c1",
                "label": "Exchange Funding",
                "funding_wallet": "SolflareExchangeWallet" + "x" * 20,
                "funded_wallets": [f"Holder_{i}_{address[5:9]}" for i in range(1, 4)],
                "total_funding_sol": round(random.uniform(10.0, 50.0), 1),
                "creation_date_proximity": "Aged wallets (months to years old)",
                "buy_timing_proximity": "Organic buys spread across multiple blocks"
            }
        ]
        
        metrics = {
            "supply_early_blocks": concentration,
            "dev_supply": round(random.uniform(0.0, 4.0), 1),
            "top_10_holders_ex_liquidity": round(random.uniform(10.0, 25.0), 1),
            "liquidity_locked": True,
            "renounced_ownership": True
        }
        
        dev_history = [
            {
                "mint": "None",
                "name": "No prior launches detected",
                "symbol": "N/A",
                "action": "ORGANIC_GROWTH",
                "date": "N/A",
                "peak_market_cap": "$0",
                "current_market_cap": "$0"
            }
        ]
        
        agent_logs = [
            f"[Swarms Agent: CabalRadar] Initiating scan for token: {name} ({symbol})",
            "[Tool: get_signatures] Checked block transactions. 0 sybil indicators found.",
            "[Swarms Agent: CabalRadar] Tracing funding flow...",
            "[Swarms Agent: CabalRadar] Found standard funding trails originating from centralized exchanges.",
            f"[Swarms Agent: CabalRadar] Checked Dev wallet {dev_address[:10]}... history is clean.",
            f"[Swarms Agent: CabalRadar] Supply Concentration index is {concentration}%, safe.",
            "[Swarms Agent: CabalRadar] Verdict: ORGANIC GROWTH."
        ]

    return {
        "mint": address,
        "name": name,
        "symbol": symbol,
        "dev_address": dev_address,
        "concentration_index": concentration,
        "verdict": verdict,
        "verdict_reason": verdict_reason,
        "risk_factors": risk_factors,
        "clusters": clusters,
        "metrics": metrics,
        "dev_history": dev_history,
        "agent_logs": agent_logs
    }
