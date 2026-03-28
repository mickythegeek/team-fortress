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

# Import RAG components
import chromadb
from sentence_transformers import SentenceTransformer
from answer_engine import generate_answer

app = FastAPI(title="Intelligence API")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8780", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG components on startup
VECTOR_DIR = AI_ASSISTANT_PATH / "data" / "vectorstore"
model = None
collection = None

@app.on_event("startup")
async def startup_event():
    global model, collection
    print("🚀 Initializing RAG pipeline...")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    client = chromadb.PersistentClient(path=str(VECTOR_DIR))
    collection = client.get_or_create_collection("support_knowledge")
    print(f"📦 Loaded {collection.count()} documents from vector store")
    print("🤖 LLM (Gemini) answer engine loaded")

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
    if model is None or collection is None:
        return [], []
    
    query_embedding = model.encode(question).tolist()
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
    llm_response = generate_answer(request.message, documents)
    
    return {
        "response": llm_response,
        "sources": sources
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
