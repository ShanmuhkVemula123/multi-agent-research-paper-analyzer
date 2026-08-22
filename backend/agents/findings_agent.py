import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_findings(text: str) -> str:
    client = get_client()
    prompt = f"""
    Analyze the following research paper text and identify:
    * Major findings
    * Results
    * Important observations
    * Performance metrics
    * Comparisons with existing approaches
    * Main conclusions
    
    If information is not available in the paper, explicitly say: "Not mentioned in the paper."
    Do not hallucinate information.
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
        return f"Error during findings analysis: {str(e)}"
