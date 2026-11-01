import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

# Ensure backend directory is in sys.path for direct or module execution
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Load environment variables
load_dotenv()

from database import engine, Base, get_db
import models
import schemas
from services.pdf_reader import save_upload_file, extract_text_from_pdf
from services.report_generator import generate_markdown_report
from agents.coordinator_agent import coordinate_analysis

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Multi-Agent Research Paper Analyzer")

# Configure CORS for local development and deployed Vercel frontend
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
frontend_url = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

if allowed_origins_env:
    for origin in allowed_origins_env.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

if frontend_url:
    cleaned = frontend_url.strip()
    if cleaned and cleaned not in origins:
        origins.append(cleaned)

has_custom_origins = bool(allowed_origins_env or frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if has_custom_origins else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app" if not has_custom_origins else None,
    allow_credentials=True if has_custom_origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(BASE_DIR, "uploads"))
REPORT_DIR = os.getenv("REPORT_DIR", os.path.join(BASE_DIR, "reports"))
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


@app.get("/")
def read_root():
    return {"message": "Multi-Agent Research Paper Analyzer API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "multi-agent-research-paper-analyzer"}


@app.post("/upload", response_model=schemas.PaperResponse)
async def upload_paper(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Save file safely
        file_path = await save_upload_file(file, UPLOAD_DIR)
        
        # Extract text
        extracted_text = extract_text_from_pdf(file_path)
        
        # Save to DB
        db_paper = models.Paper(
            filename=file.filename,
            title=file.filename, # Will be updated by summary agent potentially
            extracted_text=extracted_text,
            status="extracted"
        )
        db.add(db_paper)
        db.commit()
        db.refresh(db_paper)
        
        return db_paper
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze/{paper_id}", response_model=schemas.AnalysisResponse)
async def analyze_paper(paper_id: int, db: Session = Depends(get_db)):
    db_paper = db.query(models.Paper).filter(models.Paper.id == paper_id).first()
    if not db_paper:
        raise HTTPException(status_code=404, detail="Paper not found")
        
    if db_paper.status == "analyzed" and db_paper.analysis:
        return db_paper.analysis
        
    try:
        # Run Coordinator Agent
        analysis_results = await coordinate_analysis(db_paper.extracted_text)
        
        # Save analysis
        db_analysis = models.Analysis(
            paper_id=paper_id,
            summary=analysis_results.get("summary"),
            methodology=analysis_results.get("methodology"),
            findings=analysis_results.get("findings"),
            strengths=analysis_results.get("strengths"),
            weaknesses=analysis_results.get("weaknesses"),
            research_gaps=analysis_results.get("research_gaps"),
            future_research=analysis_results.get("future_research"),
        )
        db.add(db_analysis)
        
        # Update paper status
        db_paper.status = "analyzed"
        
        db.commit()
        db.refresh(db_analysis)
        
        return db_analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/papers", response_model=list[schemas.PaperResponse])
def get_papers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    papers = db.query(models.Paper).offset(skip).limit(limit).all()
    return papers


@app.get("/papers/{paper_id}", response_model=schemas.PaperResponse)
def get_paper(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(models.Paper).filter(models.Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper


@app.get("/reports/{paper_id}")
def get_report(paper_id: int, db: Session = Depends(get_db)):
    paper = db.query(models.Paper).filter(models.Paper.id == paper_id).first()
    if not paper or not paper.analysis:
        raise HTTPException(status_code=404, detail="Analysis not found for this paper")
        
    report_filename = f"report_{paper_id}.md"
    report_path = os.path.join(REPORT_DIR, report_filename)
    
    analysis_data = {
        "summary": paper.analysis.summary,
        "methodology": paper.analysis.methodology,
        "findings": paper.analysis.findings,
        "strengths": paper.analysis.strengths,
        "research_gaps": paper.analysis.research_gaps
    }
    
    generate_markdown_report(paper.title, analysis_data, report_path)
    
    return FileResponse(path=report_path, filename=report_filename, media_type='text/markdown')


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
