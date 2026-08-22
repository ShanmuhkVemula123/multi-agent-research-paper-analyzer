import os
from dotenv import load_dotenv

load_dotenv()
key = os.getenv('GEMINI_API_KEY')

if key is None:
    print("KEY IS NONE")
else:
    print(f"Length: {len(key)}")
    print(f"Starts with quote? {key.startswith(chr(34)) or key.startswith(chr(39))}")
    print(f"Ends with quote? {key.endswith(chr(34)) or key.endswith(chr(39))}")
    print(f"Has whitespace? {' ' in key}")
