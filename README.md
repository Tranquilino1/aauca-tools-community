# AAUCATools Community

Plataforma integral para estudiantes con herramientas de IA y conversión de documentos.

## Características
1. **Conversión de PDF:** PDF a Word, Excel y PPT.
2. **Transcripción:** Audio a texto usando Groq (Whisper-3).
3. **NotebookLM:** Chat con PDFs y libros usando Gemini 1.5 Flash.
4. **Infraestructura:** Next.js 15, FastAPI y Supabase.

## Requisitos
- Docker y Docker Compose
- API Keys de Gemini y Groq
- Proyecto en Supabase

## Configuración
1. Copia el archivo `.env.example` a `.env` y rellena las variables.
2. Ejecuta `docker-compose up --build`.

## Despliegue
- **Frontend:** Vercel
- **Backend:** Hugging Face Spaces o Render (Tier Gratuito)
- **Base de Datos:** Supabase
