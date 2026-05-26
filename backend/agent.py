import os
import logging
from typing import Dict, Any

logger = logging.getLogger("CabalAgent")

# Try importing the official swarms library
try:
    from swarms import Agent
    SWARMS_AVAILABLE = True
except ImportError:
    SWARMS_AVAILABLE = False
    logger.warning("swarms Python package not found. Running Swarms agent in simulation mode.")

SYSTEM_PROMPT = """
You are the Meme Coin Cabal Radar & Insider Wallet Tracker AI Agent.
Your role is to analyze Solana token addresses and evaluate security threats.
Specifically:
1. Identify wallet clusters sharing seed funding or exhibiting coordinated buying.
2. Calculate the supply concentration index in the first 1-5 blocks of launch.
3. Audit developer behavior history (check prior rugs, serial launch address links).
4. Render a clear verdict: HIGH COBWEB RISK (cabal controlled) or ORGANIC GROWTH.

Explain your logical step-by-step reasoning clearly, detailing every tool execution.
"""

class SwarmsCabalAgentWrapper:
    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.agent = None

        if SWARMS_AVAILABLE and self.api_key:
            try:
                # Initialize real Swarms Agent
                self.agent = Agent(
                    agent_name="CabalRadarAgent",
                    agent_description="Detects wallet coordination and rug pull risks on Solana.",
                    system_prompt=SYSTEM_PROMPT,
                    model_name=self.model_name,
                    max_loops=1,
                    output_type="final"
                )
                logger.info("Official Swarms Agent successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize Swarms Agent: {e}. Falling back to simulator.")
                self.agent = None

    def run_analysis(self, scan_result: Dict[str, Any]) -> str:
        """
        Executes the agent logic.
        Feeds the raw metrics to the real Swarms Agent and gets the AI output.
        If a real Swarms Agent is not configured, raises a RuntimeError.
        """
        if not self.agent or not self.api_key:
            raise RuntimeError("Swarms AI Agent framework is not configured (missing OpenAI API Key or swarms library).")

        prompt = f"""
        Analyze this scanned token:
        Name: {scan_result['name']} ({scan_result['symbol']})
        Mint: {scan_result['mint']}
        Dev Wallet: {scan_result['dev_address']}
        Concentration Index: {scan_result['concentration_index']}%
        Verdict: {scan_result['verdict']}
        Risk Factors: {', '.join(scan_result['risk_factors'])}
        Number of Clusters: {len(scan_result['clusters'])}
        """

        try:
            return self.agent.run(prompt)
        except Exception as e:
            logger.error(f"Error running Swarms Agent: {e}")
            raise e

# Instantiate default wrapper
cabal_agent = SwarmsCabalAgentWrapper()
