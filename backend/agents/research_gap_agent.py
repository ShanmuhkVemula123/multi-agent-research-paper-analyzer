import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_client():
    return genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_research_gap(text: str) -> str:
    client = get_client()
    prompt = f"""
    Analyze the following research paper text and identify:
    * Existing problem
    * What the paper solves
    * What remains unsolved
    * Missing research areas
    * Possible future research
    * Potential improvements
    * Possible project ideas based on the paper
    
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
        return f"Error during research gap analysis: {str(e)}"
