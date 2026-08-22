from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from database import engine, Base, get_db
import models
import schemas
from services.pdf_reader import save_upload_file, extract_text_from_pdf
from services.report_generator import generate_markdown_report
from agents.coordinator_agent import coordinate_analysis
from fastapi.responses import FileResponse

# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Multi-Agent Research Paper Analyzer")

# Configure CORS for local development with React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
REPORT_DIR = "reports"

@app.get("/")
def read_root():
    return {"message": "Multi-Agent Research Paper Analyzer API is running"}

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
