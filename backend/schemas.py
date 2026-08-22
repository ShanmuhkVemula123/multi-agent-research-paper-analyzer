from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnalysisBase(BaseModel):
    summary: Optional[str] = None
    methodology: Optional[str] = None
    findings: Optional[str] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    research_gaps: Optional[str] = None
    future_research: Optional[str] = None

class AnalysisResponse(AnalysisBase):
    id: int
    paper_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PaperBase(BaseModel):
    filename: str
    title: Optional[str] = None

class PaperCreate(PaperBase):
    pass

class PaperResponse(PaperBase):
    id: int
    status: str
    created_at: datetime
    analysis: Optional[AnalysisResponse] = None

    class Config:
        from_attributes = True
