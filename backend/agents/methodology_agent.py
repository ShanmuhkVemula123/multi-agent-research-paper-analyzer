import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_methodology(text: str) -> str:
    client = get_client()
    prompt = f"""
    Analyze the following research paper text and identify:
    * Research methodology
    * Dataset
    * Algorithms
    * Models
    * Experimental setup
    * Tools/technologies
    * Evaluation metrics
    
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
        return f"Error during methodology analysis: {str(e)}"
