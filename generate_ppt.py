from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def apply_dark_theme(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(20, 20, 30)  # Very dark blue/grey

def format_title(title_shape):
    if title_shape and title_shape.text_frame:
        for paragraph in title_shape.text_frame.paragraphs:
            for run in paragraph.runs:
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.bold = True
                run.font.name = "Segoe UI"

def format_body(body_shape):
    if body_shape and body_shape.text_frame:
        for paragraph in body_shape.text_frame.paragraphs:
            for run in paragraph.runs:
                run.font.color.rgb = RGBColor(220, 220, 230)
                run.font.name = "Segoe UI"

def create_presentation():
    prs = Presentation()

    # SLIDE 1: Title
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    apply_dark_theme(slide)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    title.text = "Multi-Agent Research Paper Analyzer"
    subtitle.text = "An Agentic AI System for Automated Research Paper Analysis\n\nDeveloped by: Your Name/Team\nStack: React, FastAPI, Google Gemini 3.5-Flash"
    format_title(title)
    
    # Subtitle formatting
    for p in subtitle.text_frame.paragraphs:
        for run in p.runs:
            run.font.color.rgb = RGBColor(180, 180, 200)
            run.font.name = "Segoe UI"

    # SLIDE 2: Problem Statement
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "The Research Overload Problem"
    body.text = (
        "Analyzing modern research papers is fundamentally inefficient.\n\n"
        "• Length & Complexity: Papers span 30-50 pages with dense jargon.\n"
        "• Scattered Information: Methodology and limitations are buried.\n"
        "• Time Inefficiency: Manual reading takes hours per paper.\n"
        "• Standard AI Fails: Generic summarizers miss deep structural nuances."
    )
    format_title(title)
    format_body(body)

    # SLIDE 3: Existing System
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Traditional Approach & Limitations"
    body.text = (
        "Workflow:\n"
        "Research Paper -> Manual Reading -> Manual Analysis -> Note Taking -> Summary\n\n"
        "Limitations:\n"
        "• Highly time-consuming and subjective.\n"
        "• Inconsistent manual analysis.\n"
        "• Single-LLM Failure: Conversational AI lacks specialized reasoning."
    )
    format_title(title)
    format_body(body)

    # SLIDE 4: Proposed System
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Proposed: Multi-Agent System"
    body.text = (
        "Instead of one AI doing everything, we distribute analysis across specialized virtual agents.\n\n"
        "Workflow:\n"
        "1. PDF Upload -> Text Extraction\n"
        "2. Specialized AI Agents analyze specific sections\n"
        "3. Summary | Methodology | Findings | Strengths | Gaps\n"
        "4. Result Aggregation\n"
        "5. Final Structured Markdown Report"
    )
    format_title(title)
    format_body(body)

    # SLIDE 5: Objectives
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Core Objectives"
    body.text = (
        "• Automated Extraction: Instantly extract text from PDF papers.\n"
        "• Specialized Analysis: Isolate specific research domains using agents.\n"
        "• Structured Insights: Generate highly organized research insights.\n"
        "• Time Reduction: Compress hours of reading into seconds.\n"
        "• Clear Reporting: Produce clean, formatted Markdown reports.\n"
        "• Extensible Architecture: Foundation for adding infinite future agents."
    )
    format_title(title)
    format_body(body)

    # SLIDE 6: System Architecture
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "System Architecture"
    body.text = (
        "Frontend: React (Uploads PDF & Displays Results)\n"
        "Backend: FastAPI (Handles API Routing & Workflows)\n"
        "Database: SQLite (Stores extracted text and AI analysis)\n"
        "Orchestration: Coordinator Agent -> Master Agent\n"
        "AI API: Google Gemini 3.5-Flash (Returns strict JSON)\n\n"
        "All components communicate securely via REST APIs and Environment Variables."
    )
    format_title(title)
    format_body(body)

    # SLIDE 7: Multi-Agent Architecture
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "The 5 Specialized Virtual Agents"
    body.text = (
        "• Summary Agent: Extracts main objective, problem, and core concepts.\n"
        "• Methodology Agent: Identifies datasets, algorithms, and metrics.\n"
        "• Findings Agent: Isolates major results and conclusions.\n"
        "• Strengths Agent: Evaluates technical merits and study limitations.\n"
        "• Research Gaps Agent: Pinpoints what remains unsolved for future work.\n\n"
        "*Orchestrated via Master Prompt Simulation to optimize daily API quotas."
    )
    format_title(title)
    format_body(body)

    # SLIDE 8: Execution Workflow
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Step-by-Step Execution Workflow"
    body.text = (
        "1. Upload: User drops PDF into the sleek React interface.\n"
        "2. Extraction: Backend uses pypdf to strip binary text.\n"
        "3. Orchestration: coordinator_agent passes text to the AI layer.\n"
        "4. API Integration: Gemini processes the paper in a massive 1M-token context.\n"
        "5. Schema Enforcement: Pydantic strictly forces Gemini to output valid JSON.\n"
        "6. Delivery: Database saves the JSON and sends it to the frontend."
    )
    format_title(title)
    format_body(body)

    # SLIDE 9: Technology Stack
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Technology Stack"
    body.text = (
        "• Frontend: React, Vite, JavaScript, Custom CSS (Glassmorphism)\n"
        "• Backend: Python, FastAPI, Uvicorn\n"
        "• Artificial Intelligence: Google Gemini 3.5-Flash API\n"
        "• PDF Processing: pypdf\n"
        "• Database & Security: SQLite, SQLAlchemy, python-dotenv\n"
        "• Data Validation: Pydantic (Strict JSON Schemas)"
    )
    format_title(title)
    format_body(body)

    # SLIDE 10: Implementation Details
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Key Engineering Features"
    body.text = (
        "1. Asynchronous Execution:\n"
        "   FastAPI uses async/await to prevent the server from freezing during AI calls.\n\n"
        "2. Strict JSON Schemas:\n"
        "   pydantic.BaseModel and response_mime_type guarantee the AI returns a perfect JSON object, preventing frontend crashes.\n\n"
        "3. Simulated Orchestration:\n"
        "   Simulates 5 agents within one optimized Master payload to bypass Free Tier limits."
    )
    format_title(title)
    format_body(body)

    # SLIDE 11: AI Integration (Gemini)
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "AI Integration: Gemini 3.5-Flash"
    body.text = (
        "Why Gemini?\n"
        "• 1-Million Token Context Window allows feeding the ENTIRE unchunked PDF directly into the model.\n\n"
        "Security:\n"
        "• API keys are strictly injected via secure environment variables (.env) and never hardcoded."
    )
    format_title(title)
    format_body(body)

    # SLIDE 12: Output / Results
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Intelligent Result Generation"
    body.text = (
        "Input: Raw PDF binary file.\n\n"
        "Output:\n"
        "• Real-time loading dashboard with shimmering animations.\n"
        "• Segregated, easily readable summary cards for each specialized agent's findings.\n"
        "• Downloadable consolidated Markdown (.md) report."
    )
    format_title(title)
    format_body(body)

    # SLIDE 13: Advantages
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "System Advantages"
    body.text = (
        "• Massive Time Savings: Reduces reading time by 99%.\n"
        "• Specialized Precision: Multi-agent design captures details generic AI misses.\n"
        "• Structured Output: Pydantic ensures beautiful, consistent UI rendering.\n"
        "• Cost Efficient: Master-agent prompt heavily optimizes API quota.\n"
        "• Modern Interface: Premium Glassmorphic UI provides excellent UX.\n"
        "• Extensible: Foundation allows adding infinite new agents easily."
    )
    format_title(title)
    format_body(body)

    # SLIDE 14: Limitations & Future Scope
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    apply_dark_theme(slide)
    title, body = slide.shapes.title, slide.placeholders[1]
    title.text = "Limitations & Future Scope"
    body.text = (
        "Current Limitations:\n"
        "• Text Only: Ignores graphs, charts, and images inside the PDF.\n"
        "• API Dependency: Bound by Google API daily rate limits (20/day free).\n\n"
        "Future Scope:\n"
        "• Vision AI Integration: Analyze graphs and complex equations.\n"
        "• New Agents: Citation Verification and Plagiarism Detection.\n"
        "• User Authentication: Allow saving of past paper histories."
    )
    format_title(title)
    format_body(body)

    # SLIDE 15: Conclusion
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    apply_dark_theme(slide)
    title = slide.shapes.title
    subtitle = slide.placeholders[1]
    title.text = "Conclusion"
    subtitle.text = (
        "The Multi-Agent Research Paper Analyzer successfully demonstrates how Agentic AI "
        "can divide complex cognitive tasks into specialized sub-tasks.\n\n"
        "Thank You!\nQuestions?"
    )
    format_title(title)
    
    for p in subtitle.text_frame.paragraphs:
        for run in p.runs:
            run.font.color.rgb = RGBColor(180, 180, 200)
            run.font.name = "Segoe UI"

    prs.save("Multi-Agent_Analyzer_Presentation.pptx")
    print("Presentation created successfully.")

if __name__ == "__main__":
    create_presentation()
