from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from groq import Groq
import os
from dotenv import load_dotenv
from pdf2docx import Converter
import pdfplumber
import pandas as pd
from pptx import Presentation
from pptx.util import Inches
import shutil
import uuid
from utils.rag import RAGManager

rag = RAGManager()

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://aauca-tools-community.vercel.app",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging para depuración
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Clientes de IA
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

UPLOAD_DIR = "uploads"
CONVERT_DIR = "converted"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(CONVERT_DIR, exist_ok=True)

@app.post("/convert")
async def convert_file(file: UploadFile = File(...), target_format: str = Form(...)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    output_filename = f"{file_id}.{target_format}"
    output_path = os.path.join(CONVERT_DIR, output_filename)
    
    try:
        if target_format == "docx":
            cv = Converter(input_path)
            cv.convert(output_path)
            cv.close()
        
        elif target_format == "xlsx":
            with pdfplumber.open(input_path) as pdf:
                all_tables = []
                for page in pdf.pages:
                    table = page.extract_table()
                    if table:
                        all_tables.append(pd.DataFrame(table))
                if all_tables:
                    df = pd.concat(all_tables)
                    df.to_excel(output_path, index=False)
                else:
                    raise HTTPException(status_code=400, detail="No se encontraron tablas en el PDF")
        
        elif target_format == "pptx":
            prs = Presentation()
            with pdfplumber.open(input_path) as pdf:
                for page in pdf.pages:
                    slide = prs.slides.add_slide(prs.slide_layouts[5])
                    text = page.extract_text()
                    if text:
                        textbox = slide.shapes.add_textbox(Inches(1), Inches(1), Inches(8), Inches(5))
                        textbox.text = text
            prs.save(output_path)
            
        return {"download_url": f"/download/{output_filename}", "status": "success"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import FileResponse

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(CONVERT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Archivo no encontrado")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        with open(temp_path, "rb") as audio_file:
            transcription = groq_client.audio.transcriptions.create(
                file=(temp_path, audio_file.read()),
                model="whisper-large-v3",
                response_format="text"
            )
        return {"text": transcription}
    finally:
        os.remove(temp_path)

@app.post("/summarize")
async def summarize(text: str = Form(...)):
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"Resume el siguiente contenido académico de forma estructurada y profesional: {text}"
    response = model.generate_content(prompt)
    return {"summary": response.text}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Extraer texto y subir a Supabase (Simplificado para demostración)
    try:
        with pdfplumber.open(input_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    await rag.store_chunk(file_id, text, i + 1)
        
        return {"status": "success", "file_id": file_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_docs(question: str = Form(...), file_id: str = Form(None)):
    # Buscar contexto en Supabase
    context_chunks = await rag.query(question, file_id)
    context_text = "\n".join([c['content'] for c in context_chunks]) if context_chunks else ""
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    prompt = f"""
    Eres un asistente académico de la AAUCA. Responde la pregunta basándote únicamente en el contexto proporcionado.
    Si la información no está en el contexto, dilo amablemente.
    
    CONTEXTO:
    {context_text}
    
    PREGUNTA:
    {question}
    """
    
    response = model.generate_content(prompt)
    return {"response": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
