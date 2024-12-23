import os
from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel
import httpx
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import whisper
import uuid

load_dotenv()

app = FastAPI()

# Allow requests from your React dev server, or wherever you are hosting
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add others if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# If you want to store your OpenAI key in .env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

########################################
# Chat with OpenAI GPT-4
########################################
class ChatRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o-txt"

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Uses the OpenAI API to do chat completions with GPT-4.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not set.")
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": request.prompt}],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            reply = result["choices"][0]["message"]["content"]
            return {"reply": reply}
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)

########################################
# Audio Transcription Endpoint (Whisper)
########################################
@app.post("/api/audio-transcribe")
async def audio_transcribe(file: UploadFile = File(...)):
    """
    Accepts an audio file, transcribes it using Whisper, and returns the transcript.
    """
    try:
        # Save to a temporary filename:
        # Use a random ID so multiple calls won't overwrite
        tmp_filename = f"temp_{uuid.uuid4()}.wav"

        # Read file contents into memory
        contents = await file.read()
        with open(tmp_filename, "wb") as f:
            f.write(contents)

        # Load Whisper model
        model = whisper.load_model("base")  # You can pick "tiny", "base", "medium", etc.

        # Transcribe
        result = model.transcribe(tmp_filename)
        transcript = result.get("text", "")

        # Optionally: remove the temp file or keep it
        os.remove(tmp_filename)

        return {"transcript": transcript}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

########################################
# Placeholder for Image Upload Endpoint
########################################
@app.post("/api/image-upload")
async def image_upload(file: UploadFile = File(...)):
    """
    Placeholder for an image-upload endpoint. 
    In practice, you'd store the image to disk or cloud storage,
    and possibly run a model. 
    """
    try:
        # Example: just read size, do nothing special yet
        contents = await file.read()
        size_in_kb = round(len(contents)/1024, 2)
        # Return a message
        return {"message": f"Received image file ({size_in_kb} KB). Processing logic needed here."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

########################################
# Placeholder for a Web Search Endpoint
########################################
@app.post("/api/web-search")
async def web_search(query: str):
    """
    A placeholder for web search. In real usage, 
    you'd call an external search API or local process 
    to handle the query, then parse results.
    """
    # e.g. call your Node-based search or some external API
    # return JSON of summarized results
    try:
        # For demonstration:
        dummy_results = [
            {"title": "Result 1", "url": "http://example.com/1", "snippet": "Fake snippet 1..."},
            {"title": "Result 2", "url": "http://example.com/2", "snippet": "Fake snippet 2..."}
        ]
        return {"results": dummy_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

########################################
# End main.py
########################################
