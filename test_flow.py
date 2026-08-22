import os
import requests
from reportlab.pdfgen import canvas
import time

API_URL = "http://127.0.0.1:8000"

def create_sample_pdf(filename="sample_paper.pdf"):
    c = canvas.Canvas(filename)
    c.drawString(100, 750, "Sample Research Paper for Testing")
    c.drawString(100, 730, "Abstract: This is a test paper to verify text extraction.")
    c.drawString(100, 710, "Methodology: We used a fake dataset.")
    c.drawString(100, 690, "Conclusion: Testing is successful.")
    c.save()
    return filename

def test_api():
    print("1. Creating sample PDF...")
    pdf_path = create_sample_pdf()
    
    print("2. Testing /upload endpoint...")
    with open(pdf_path, "rb") as f:
        files = {"file": (pdf_path, f, "application/pdf")}
        try:
            response = requests.post(f"{API_URL}/upload", files=files)
            print(f"Upload Response Code: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print("Upload Success. Data:")
                print(data)
                paper_id = data["id"]
            else:
                print(f"Upload Failed: {response.text}")
                return
        except requests.exceptions.ConnectionError:
            print("Failed to connect to backend API. Is it running?")
            return

    print(f"\n3. Testing /analyze/{paper_id} endpoint...")
    response = requests.post(f"{API_URL}/analyze/{paper_id}")
    print(f"Analyze Response Code: {response.status_code}")
    print("Analyze Response Data:")
    print(response.json())
    
    print(f"\n4. Testing /reports/{paper_id} endpoint...")
    response = requests.get(f"{API_URL}/reports/{paper_id}")
    print(f"Report Response Code: {response.status_code}")
    if response.status_code == 200:
        print("Report Content (first 200 chars):")
        print(response.text[:200])

if __name__ == "__main__":
    # Give the backend a second to ensure it's fully up
    time.sleep(2)
    test_api()
