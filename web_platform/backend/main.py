from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import sys
import os
from dotenv import load_dotenv

load_dotenv()

# Add ai-support-assistant to Python path for imports
AI_ASSISTANT_PATH = Path(__file__).resolve().parent.parent.parent / "ai-support-assistant"
sys.path.insert(0, str(AI_ASSISTANT_PATH))
sys.path.insert(0, str(AI_ASSISTANT_PATH / "app"))

# Heavy ML components will be lazy-imported to prevent timeouts

app = FastAPI(title="Intelligence API")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the MVP
    allow_credentials=False, # Must be false if origins is *
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG components on startup
VECTOR_DIR = AI_ASSISTANT_PATH / "data" / "vectorstore"
collection = None

@app.on_event("startup")
async def startup_event():
    print("🚀 FastAPI Server starting! ML components will load lazily.")

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class Source(BaseModel):
    file: str
    excerpt: str

class ChatResponse(BaseModel):
    response: str
    sources: List[Source] = []

def query_rag(question: str, n_results: int = 5):
    """Query the RAG pipeline and return results with sources."""
    global collection
        
    if collection is None:
        print("⏳ Connecting to Vector Database...")
        import chromadb
        client = chromadb.PersistentClient(path=str(VECTOR_DIR))
        collection = client.get_or_create_collection("support_knowledge")
    
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    
    result = genai.embed_content(
        model="models/gemini-embedding-001",
        content=question,
        task_type="retrieval_query"
    )
    query_embedding = result['embedding']
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    
    sources = []
    for doc, meta in zip(documents, metadatas):
        sources.append({
            "file": meta.get("source_file", "unknown"),
            "excerpt": doc[:300] + "..." if len(doc) > 300 else doc
        })
    
    return documents, sources

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "Fortress-intelligence-backend",
        "rag_loaded": collection is not None
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    documents, sources = query_rag(request.message)
    
    if not documents:
        return {
            "response": "I couldn't find relevant information. Please try rephrasing your question.",
            "sources": []
        }
    
    # Use LLM to generate a natural language answer from the documents
    from answer_engine import generate_answer
    llm_response = generate_answer(request.message, documents)
    
    return {
        "response": llm_response,
        "sources": sources
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
