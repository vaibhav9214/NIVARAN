import os
from typing import Optional
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(dotenv_path)

from ai_service.schemas import (
    SummarizeRequest, SummarizeResponse,
    ClassificationRequest, ClassificationResponse,
    MissingInfoRequest, MissingInfoResponse,
    OfficerSuggestionsRequest, OfficerSuggestionsResponse,
    AnalyzeGrievanceRequest, AnalyzeGrievanceResponse,
    TrendsRequest, TrendsResponse
)
from ai_service import gemini_client

app = FastAPI(
    title="NIVARAN AI Grievance Intelligence Service",
    description="FastAPI Microservice powered by Google Gemini (gemini-3.5-flash) for NIVARAN College Grievance System.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
@app.get("/health")
def health_check(x_gemini_api_key: Optional[str] = Header(None)):
    key_configured = gemini_client.is_api_key_configured(x_gemini_api_key)
    return {
        "status": "online",
        "service": "NIVARAN AI Intelligence Microservice",
        "framework": "FastAPI",
        "model": gemini_client.GEMINI_MODEL,
        "gemini_api_key_configured": key_configured,
        "mode": "live_gemini_api" if key_configured else "resilient_fallback",
        "checkpoint": "AI suggestions are advisory only and never silently alter official grievance statuses."
    }

# 1. Summarize Long Grievance Descriptions
@app.post("/ai/summarize", response_model=SummarizeResponse)
def summarize_endpoint(req: SummarizeRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        return gemini_client.summarize_description(
            title=req.title,
            description=req.description,
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Suggest Categories and Departments
@app.post("/ai/classify", response_model=ClassificationResponse)
def classify_endpoint(req: ClassificationRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        return gemini_client.suggest_classification(
            title=req.title,
            description=req.description,
            available_categories=req.available_categories,
            available_departments=req.available_departments,
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Identify Potentially Missing Information
@app.post("/ai/missing-info", response_model=MissingInfoResponse)
def missing_info_endpoint(req: MissingInfoRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        return gemini_client.identify_missing_info(
            title=req.title,
            description=req.description,
            category=req.category,
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Generate Officer-facing Follow-up Suggestions
@app.post("/ai/officer-suggestions", response_model=OfficerSuggestionsResponse)
def officer_suggestions_endpoint(req: OfficerSuggestionsRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        return gemini_client.generate_followup_suggestions(
            title=req.title,
            description=req.description,
            category=req.category,
            department=req.department,
            current_status=req.current_status,
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Comprehensive Single-Grievance Analysis (Sequences 1-4 combined)
@app.post("/ai/analyze", response_model=AnalyzeGrievanceResponse)
def analyze_endpoint(req: AnalyzeGrievanceRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        return gemini_client.analyze_grievance(
            title=req.title,
            description=req.description,
            category=req.category,
            department=req.department,
            current_status=req.current_status,
            available_categories=req.available_categories,
            available_departments=req.available_departments,
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. Identify Trends in Aggregate Grievance Data
@app.post("/ai/trends", response_model=TrendsResponse)
def trends_endpoint(req: TrendsRequest, x_gemini_api_key: Optional[str] = Header(None)):
    try:
        grievances_data = [g.model_dump() for g in req.grievances]
        return gemini_client.identify_trends(
            grievances=grievances_data,
            timeframe=req.timeframe or "Past 30 Days",
            api_key=x_gemini_api_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ai_service.main:app", host="0.0.0.0", port=8000, reload=True)

