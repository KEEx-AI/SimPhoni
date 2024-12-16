import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-txt"

@app.post("/chat")
async def chat(request: ChatRequest):
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not set.")
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": request.prompt}]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            reply = result['choices'][0]['message']['content']
            return {"reply": reply}
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)

# Add endpoints for Ollama or Stable Diffusion as needed, similar pattern:
# For example, if you run Ollama locally:
# @app.post("/ollama")
# async def ollama(request: OllamaRequest):
#   ...
