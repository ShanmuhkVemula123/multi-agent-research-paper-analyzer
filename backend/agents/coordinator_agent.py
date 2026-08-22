import asyncio
from .master_agent import analyze_all

def run_agent_in_executor(func, text):
    loop = asyncio.get_event_loop()
    return loop.run_in_executor(None, func, text)

async def coordinate_analysis(extracted_text: str):
    """
    The Coordinator Agent now uses a single Master Agent to perform 
    all extractions in a single API request, bypassing daily quota limits.
    """
    
    max_chars = 500000
    if len(extracted_text) > max_chars:
        text_to_analyze = extracted_text[:max_chars] + "\n...[Content truncated due to size limits]..."
    else:
        text_to_analyze = extracted_text

    # Single call to Master Agent to save quota
    result_dict = await run_agent_in_executor(analyze_all, text_to_analyze)

    return {
        "summary": result_dict.get("summary", ""),
        "methodology": result_dict.get("methodology", ""),
        "findings": result_dict.get("findings", ""),
        "strengths": result_dict.get("strengths", ""),
        "weaknesses": "", # Handled in strengths
        "research_gaps": result_dict.get("research_gaps", ""),
        "future_research": "" # Handled in research_gaps
    }
