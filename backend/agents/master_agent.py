import os
import json
import re
from google import genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class AnalysisResult(BaseModel):
    summary: str
    methodology: str
    findings: str
    strengths: str
    research_gaps: str

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_all(text: str) -> dict:
    client = get_client()
    prompt = f"""
    You are an expert Research Paper Analyzer. Analyze the following research paper text and extract the information into the required JSON structure.
    
    If information is not available in the paper, explicitly state: "Not mentioned in the paper."
    IMPORTANT: Make sure to escape all internal quotes properly so the output is strictly valid JSON.
    Do not use unescaped double quotes inside the string values. Use single quotes or escape them.
    
    Research Paper Text:
    {text}
    """
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
                'response_schema': AnalysisResult
            }
        )
        
        # Robust parsing: remove markdown block if present
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        return json.loads(raw_text.strip())
    except Exception as e:
        error_msg = f"Error during master analysis: {str(e)}"
        return {
            "summary": error_msg,
            "methodology": error_msg,
            "findings": error_msg,
            "strengths": error_msg,
            "research_gaps": error_msg
        }
