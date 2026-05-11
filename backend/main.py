import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from groq import Groq
from supabase import create_client, Client
from dotenv import load_dotenv
import shutil
from pdf2docx import Converter
import pandas as pd
import fitz  # PyMuPDF
from pptx import Presentation
from utils.rag import RAGManager

load_dotenv()

app = FastAPI(title="AAUCATools Community API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI & DB Clients
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""), 
    os.getenv("SUPABASE_KEY", "")
)
rag_manager = RAGManager()

SYSTEM_PROMPT = """Eres el núcleo de AAUCATools Community. Tu misión es ayudar a estudiantes a comprender material académico complejo.
* Si resumes un libro, estructura la respuesta en: Conceptos Clave, Fórmulas/Teoremas importantes y un Glosario.
* Al responder sobre un PDF cargado, siempre cita el número de página o la sección.
* Mantén un tono alentador, técnico y preciso. Si el usuario sube un audio, asume que es una clase magistral y extrae los puntos más relevantes para un examen."""

@app.get("/")
async def root():
    return {"message": "AAUCATools Community API is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Handles document uploads to Supabase Storage and initial processing."""
    try:
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Upload to Supabase Storage (Assumes 'documents' bucket exists)
        with open(file_path, "rb") as f:
            supabase.storage.from_("documents").upload(file.filename, f)
        
        os.remove(file_path)
        return {"filename": file.filename, "status": "uploaded"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summarize")
async def summarize_book(file_name: str):
    """Summarizes a book using Gemini 1.5 Flash's 1M token window."""
    try:
        # 1. Get file from Supabase Storage
        res = supabase.storage.from_("documents").download(file_name)
        
        # 2. Convert bytes to GenerativeAI Part (assuming it's a PDF)
        # Note: In a production environment, you'd use the File API for larger files
        # but for demonstration, we pass the text or the file directly if supported.
        
        # Extract text using PyMuPDF for the prompt
        doc = fitz.open(stream=res, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        
        prompt = f"{SYSTEM_PROMPT}\n\nResume el siguiente contenido:\n\n{text[:30000]}" # Limit for simple call, use File API for >30k
        
        response = gemini_model.generate_content(prompt)
        return {"summary": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/pdf-to-word")
async def convert_pdf_to_word(file_name: str):
    """Converts a PDF stored in Supabase to Word and returns it."""
    try:
        # Download from Supabase
        pdf_data = supabase.storage.from_("documents").download(file_name)
        temp_pdf = f"temp_{file_name}"
        temp_docx = temp_pdf.replace(".pdf", ".docx")
        
        with open(temp_pdf, "wb") as f:
            f.write(pdf_data)
        
        # Convert
        cv = Converter(temp_pdf)
        cv.convert(temp_docx)
        cv.close()
        
        # Return file for download
        return FileResponse(
            path=temp_docx, 
            filename=file_name.replace(".pdf", ".docx"),
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_pdf):
            os.remove(temp_pdf)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribes audio using Groq Whisper-3."""
    try:
        # Save temp file
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        with open(temp_file, "rb") as audio_file:
            translation = groq_client.audio.translations.create(
                file=(temp_file, audio_file.read()),
                model="whisper-large-v3",
            )
        
        os.remove(temp_file)
        return {"transcription": translation.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_pdf(question: str, file_id: str = None):
    """RAG-powered chat with PDF context and exact sources."""
    try:
        # 1. Search for relevant context
        context_chunks = await rag_manager.query(question, file_id)
        
        context_text = "\n\n".join([
            f"[Página {c['metadata']['page']}]: {c['content']}" 
            for c in context_chunks
        ])
        
        # 2. Generate response with Gemini
        prompt = f"{SYSTEM_PROMPT}\n\nContexto:\n{context_text}\n\nPregunta: {question}"
        response = gemini_model.generate_content(prompt)
        
        return {
            "answer": response.text,
            "sources": context_chunks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
