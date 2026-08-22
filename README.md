# Multi-Agent Research Paper Analyzer

A complete, working application that allows users to upload a research paper PDF and automatically analyze it using multiple specialized AI agents powered by Google Gemini.

## Features

- **Drag-and-Drop PDF Upload**: Securely upload research papers for analysis.
- **Multi-Agent AI Architecture**:
  - **Coordinator Agent**: Manages and distributes tasks.
  - **Summary Agent**: Extracts key concepts, objectives, and a simple summary.
  - **Methodology Agent**: Details datasets, algorithms, and models.
  - **Findings Agent**: Outlines major results and comparisons.
  - **Strengths & Weaknesses Agent**: Critiques the paper objectively.
  - **Research Gap Agent**: Highlights unsolved problems and future project ideas.
- **Beautiful UI**: Modern, responsive interface with CSS animations visualizing the agents at work.
- **Downloadable Report**: Get a compiled Markdown report of the complete analysis.

## Architecture

```text
                 Research Paper
                       │
                       ▼
              PDF Text Extraction
                       │
                       ▼
              Coordinator Agent
             /    /    |    \    \
            ▼    ▼     ▼     ▼    ▼
        Summary Method Findings Strengths Gap
          Agent  Agent  Agent   Agent  Agent
             \    \     |     /    /
              \    \    |    /    /
                    ▼
             Final Analysis
                    │
                    ▼
              Report Generator (Markdown)
```

## Technology Stack

- **Backend**: Python, FastAPI, Uvicorn, SQLAlchemy, SQLite, `pypdf`, `google-genai`
- **Frontend**: React (Vite), Axios, standard CSS
- **AI**: Google Gemini (`gemini-2.5-flash`)

## Project Structure

- `backend/`: FastAPI application, Database schema, Agents, and Services.
- `frontend/`: Vite React application and CSS styles.

## Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
4. **Important:** Add your Gemini API key to `.env`:
   ```text
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```

## Running the Application

**Start the Backend API:**
```bash
cd backend
uvicorn main:app --reload
```
The API will run at `http://127.0.0.1:8000`.
Swagger Documentation: `http://127.0.0.1:8000/docs`

**Start the Frontend React App:**
```bash
cd frontend
npm run dev
```
The frontend will typically run at `http://localhost:5173`.

## Troubleshooting

- **CORS Error**: Ensure both backend and frontend are running on the default ports (`8000` and `5173`). The backend `main.py` has a permissive CORS setup specifically for local development.
- **API Key Error**: If analysis fails, verify your `GEMINI_API_KEY` in `backend/.env` is valid and active.
- **Empty PDF**: Image-only PDFs (scanned without OCR) cannot be read by `pypdf`. Use text-based PDFs.
