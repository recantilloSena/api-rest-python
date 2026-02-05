from fastapi import FastAPI
import json
from google import genai

app = FastAPI()


@app.get("/ask/{prompt}")
def get_list(prompt : str):

    # The client gets the API key from the environment variable `GEMINI_API_KEY`.
    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-3-flash-preview", contents=  f"{prompt}"
    )
    print(response.text)     
    
    
    return {
        "data": response.text
    }