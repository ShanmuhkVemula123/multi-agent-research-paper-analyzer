import os

def generate_markdown_report(paper_title: str, analysis_data: dict, filepath: str):
    """
    Generates a structured markdown report from the analysis data.
    Saves it to the reports directory.
    """
    
    report_content = f"""# Research Paper Analysis

## 1. Paper Information
**Title/Info:** 
{paper_title}

## 2. Executive Summary
{analysis_data.get('summary', 'Not available')}

## 3. Methodology
{analysis_data.get('methodology', 'Not available')}

## 4. Major Findings
{analysis_data.get('findings', 'Not available')}

## 5. Strengths & Weaknesses
{analysis_data.get('strengths', 'Not available')}

## 6. Research Gaps & Future Work
{analysis_data.get('research_gaps', 'Not available')}

## 7. Overall Assessment
This report was generated automatically by the Multi-Agent Research Paper Analyzer.
"""
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(report_content)
        
    return filepath
