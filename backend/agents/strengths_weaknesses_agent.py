import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_strengths_weaknesses(text: str) -> str:
    client = get_client()
    prompt = f"""
    Analyze the following research paper text and identify:
    
    Strengths:
    * Technical strengths
    * Methodological strengths
    * Novel contributions
    
    Weaknesses:
    * Limitations
    * Missing information
    * Dataset limitations
    * Method limitations
    * Possible threats to validity
    
    If information is not available in the paper, explicitly say: "Not mentioned in the paper."
    Do not invent weaknesses that aren't reasonably supported by the paper.
    Format your response cleanly.
    
    Research Paper Text:
    {text}
    """
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Error during strengths & weaknesses analysis: {str(e)}"
