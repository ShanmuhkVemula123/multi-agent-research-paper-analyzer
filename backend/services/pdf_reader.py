import os
from pypdf import PdfReader
from fastapi import UploadFile, HTTPException

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a given PDF file.
    Returns a string of extracted text.
    Throws ValueError if extraction fails completely.
    """
    try:
        reader = PdfReader(file_path)
        extracted_text = ""
        
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
        
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the PDF. It might be an image-based PDF or empty.")
            
        return extracted_text
        
    except Exception as e:
        raise ValueError(f"Failed to read PDF: {str(e)}")

async def save_upload_file(upload_file: UploadFile, destination: str) -> str:
    """
    Saves an uploaded file to the local disk safely.
    """
    try:
        if not upload_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
            
        file_location = os.path.join(destination, upload_file.filename)
        
        # Ensure directory exists
        os.makedirs(destination, exist_ok=True)
        
        with open(file_location, "wb") as f:
            content = await upload_file.read()
            f.write(content)
            
        return file_location
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
