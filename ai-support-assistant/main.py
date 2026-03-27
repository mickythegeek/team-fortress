from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import uvicorn

from rag_engine import initialize_rag, query_rag

app = FastAPI(
    title="Team Fortress AI Support",
    description="AI-powered institutional intelligence for Interswitch payments",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    """Request model for RAG queries"""
    query: str
    top_k: int = 5


class QueryResponse(BaseModel):
    """Response model for RAG answers"""
    query: str
    answer: str
    sources: List[Dict]
    context_count: int


@app.on_event("startup")
async def startup_event():
    """Initialize RAG engine on startup"""
    print("🚀 Starting Team Fortress AI Support Assistant...")
    initialize_rag()
    print("✅ Application ready!")


@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "service": "Team Fortress AI Support",
        "version": "1.0.0"
    }


@app.post("/query", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    """
    Query the RAG system for Interswitch payment insights
    
    Example:
    {
        "query": "How do I authenticate with the Interswitch Payment API?",
        "top_k": 5
    }
    """
    try:
        result = query_rag(request.query)
        return QueryResponse(
            query=result['query'],
            answer=result['answer'],
            sources=result['sources'],
            context_count=result['context_count']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )