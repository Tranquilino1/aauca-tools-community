import os
from supabase import create_client, Client
import google.generativeai as genai

class RAGManager:
    def __init__(self):
        self.supabase: Client = create_client(
            os.getenv("SUPABASE_URL", ""), 
            os.getenv("SUPABASE_KEY", "")
        )
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    def get_embeddings(self, text: str):
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

    async def store_chunk(self, file_id: str, content: str, page: int):
        embedding = self.get_embeddings(content)
        data = {
            "file_id": file_id,
            "content": content,
            "metadata": {"page": page},
            "embedding": embedding
        }
        # Assumes a table named 'documents' with a vector column
        return self.supabase.table("document_chunks").insert(data).execute()

    async def query(self, question: str, file_id: str = None):
        query_embedding = self.get_embeddings(question)
        
        # RPC call to a Postgres function for vector similarity search
        rpc_params = {
            "query_embedding": query_embedding,
            "match_threshold": 0.5,
            "match_count": 5,
        }
        
        if file_id:
            rpc_params["filter_file_id"] = file_id

        try:
            result = self.supabase.rpc("match_documents", rpc_params).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Error en búsqueda vectorial: {e}")
            return []
