import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

# Load environment variables from .env file
load_dotenv()

from backend.analyzer import default_analyzer, get_solana_exploits
from backend.agent import cabal_agent

app = FastAPI(
    title="Meme Coin Cabal Radar API",
    description="Backend API powered by Swarms for detecting on-chain insider groups.",
    version="1.0.0"
)

# Enable CORS for frontend development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    agent_report: str

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Cabal Scanner & Insider Tracker"}

@app.get("/api/scan", response_model=ScanResponse)
def scan_token(address: str = Query(..., description="The Solana token mint address")):
    if not address or len(address) < 32:
        raise HTTPException(status_code=400, detail="Invalid Solana token address format.")
    
    try:
        # Run analyzer (automatically uses SOLANA_RPC_URL if configured, otherwise falls back to simulator)
        analysis_result = default_analyzer.analyze_token(address)
        
        # Run Swarms agent report (uses OPENAI_API_KEY if configured, otherwise falls back to simulator)
        report = cabal_agent.run_analysis(analysis_result)
        
        return ScanResponse(
            success=True,
            data=analysis_result,
            agent_report=report
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/exploits")
def get_exploits():
    try:
        return {"success": True, "exploits": get_solana_exploits()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app:app", host="127.0.0.1", port=port, reload=True)
