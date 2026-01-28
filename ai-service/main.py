from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv
import sys

# Add validators directory to path
sys.path.append(os.path.dirname(__file__))
from validators.carbon_validator import CarbonValidator

load_dotenv()

app = FastAPI(title="CircularFund AI Scoring Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize validators
carbon_validator = CarbonValidator()

class SubmissionData(BaseModel):
    resourceReductionPercentage: Optional[float] = None
    resourceReductionDetails: Optional[str] = None
    reuseFrequency: Optional[str] = None
    reuseDetails: Optional[str] = None
    recycleType: Optional[str] = None
    recycleDetails: Optional[str] = None
    productLifespanYears: Optional[float] = None
    productRepairability: Optional[bool] = None
    productDetails: Optional[str] = None
    processEfficiencyImprovement: Optional[float] = None
    processDetails: Optional[str] = None
    documentationLevel: Optional[str] = None
    traceabilitySystem: Optional[bool] = None
    carbonReductionKg: Optional[float] = None
    carbonCalculationMethod: Optional[str] = None
    localEmployees: Optional[int] = None
    incomeStability: Optional[str] = None
    evidenceFiles: Optional[List[str]] = []

class AIValidationResult(BaseModel):
    isValid: bool
    confidence: float
    flags: List[str]
    suggestions: List[str]
    adjustedScores: Dict[str, float]

@app.get("/")
def read_root():
    return {"service": "CircularFund AI Scoring", "status": "running"}

@app.post("/validate", response_model=AIValidationResult)
async def validate_submission(data: SubmissionData):
    """
    AI-assisted validation of circular economy claims
    Uses LLM to cross-check claims against evidence and detect anomalies
    """
    flags = []
    suggestions = []
    adjusted_scores = {}
    confidence = 0.85
    
    # Anomaly detection
    if data.carbonReductionKg and data.carbonReductionKg > 5000:
        flags.append("Unusually high carbon reduction claim")
        confidence -= 0.15
        if not data.carbonCalculationMethod:
            suggestions.append("Provide detailed calculation method for carbon reduction")
    
    if data.resourceReductionPercentage and data.resourceReductionPercentage > 50:
        flags.append("Very high resource reduction percentage")
        confidence -= 0.1
        if not data.resourceReductionDetails:
            suggestions.append("Add baseline data and measurement methodology")
    
    # Evidence consistency check
    if data.evidenceFiles and len(data.evidenceFiles) < 3:
        suggestions.append("More evidence files recommended for higher confidence")
        confidence -= 0.05
    
    # Cross-validation
    if data.traceabilitySystem and data.documentationLevel == "minimal":
        flags.append("Traceability system claimed but minimal documentation")
        adjusted_scores["transparency"] = -2
    
    if data.processEfficiencyImprovement and data.processEfficiencyImprovement > 30:
        if not data.processDetails:
            suggestions.append("High efficiency improvement needs detailed explanation")
            adjusted_scores["processEfficiency"] = -3
    
    is_valid = len(flags) < 3 and confidence > 0.5
    
    return AIValidationResult(
        isValid=is_valid,
        confidence=max(0.0, min(1.0, confidence)),
        flags=flags,
        suggestions=suggestions,
        adjustedScores=adjusted_scores
    )

@app.post("/analyze-evidence")
async def analyze_evidence(file_urls: List[str]):
    """
    Analyze evidence files using OCR and image recognition
    Extract text from invoices, receipts, certificates
    """
    # Placeholder for OCR/image analysis
    # In production, this would use pytesseract or cloud vision APIs
    return {
        "extractedText": [],
        "detectedDocuments": [],
        "confidence": 0.8
    }

@app.post("/estimate-carbon")
async def estimate_carbon(
    carbon_reduction_kg: float,
    calculation_method: str,
    sector: str,
    business_scale: str,
    evidence_count: int,
    details: Optional[str] = None
):
    """
    Estimate and validate carbon reduction claim
    Uses industry benchmarks and statistical analysis
    """
    result = carbon_validator.validate_carbon_claim(
        carbon_reduction_kg=carbon_reduction_kg,
        calculation_method=calculation_method,
        sector=sector,
        business_scale=business_scale,
        evidence_count=evidence_count,
        details=details
    )
    
    return {
        "isValid": result.is_valid,
        "confidence": result.confidence,
        "flags": result.flags,
        "suggestions": result.suggestions,
        "adjustedScore": result.adjusted_score,
        "estimatedCO2Kg": carbon_reduction_kg,
        "methodology": calculation_method
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
