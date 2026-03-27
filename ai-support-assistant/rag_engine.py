import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import google.generativeai as genai
from typing import List, Dict

# Configure Gemini
genai.configure(api_key="YOUR_GOOGLE_API_KEY")  # Set your API key

MODEL_NAME = "all-MiniLM-L6-v2"
VECTORSTORE_PATH = "../data/vectorstore"


class RAGEngine:
    def __init__(self):
        print("🚀 Initializing RAG Engine...")
        
        # Load embedding model
        self.embedding_model = SentenceTransformer(MODEL_NAME)
        
        # Connect to ChromaDB
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb_parquet",
            persist_directory=VECTORSTORE_PATH,
            anonymized_telemetry=False
        ))
        
        self.collection = self.client.get_collection(
            name="interswitch_docs"
        )
        
        print("✅ RAG Engine initialized!")
    
    def retrieve_context(self, query: str, top_k: int = 5) -> List[Dict]:
        """Retrieve relevant documents from vector store"""
        # Embed the query
        query_embedding = self.embedding_model.encode(query).tolist()
        
        # Search ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        # Format results
        context_docs = []
        for i, doc in enumerate(results['documents'][0]):
            context_docs.append({
                "rank": i + 1,
                "content": doc,
                "metadata": results['metadatas'][0][i] if results['metadatas'] else {}
            })
        
        return context_docs
    
    def generate_answer(self, query: str, context_docs: List[Dict]) -> str:
        """Generate answer using Gemini LLM with retrieved context"""
        
        # Build context string
        context_text = "\n\n".join([
            f"Document {doc['rank']}:\n{doc['content']}"
            for doc in context_docs
        ])
        
        # Create prompt
        prompt = f"""You are an AI assistant for Interswitch Payment APIs. 
Answer the user's question based on the provided documentation context.

DOCUMENTATION CONTEXT:
{context_text}

USER QUESTION:
{query}

INSTRUCTIONS:
- Provide a clear, concise answer
- Reference the specific documentation where applicable
- If the answer isn't in the context, say so clearly
- Use structured formatting for complex responses"""
        
        # Call Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return response.text
    
    def answer_query(self, query: str, top_k: int = 5) -> Dict:
        """Complete RAG pipeline: retrieve + generate"""
        print(f"📝 Processing query: {query}")
        
        # Retrieve context
        context_docs = self.retrieve_context(query, top_k)
        
        # Generate answer
        answer = self.generate_answer(query, context_docs)
        
        return {
            "query": query,
            "answer": answer,
            "sources": [
                {
                    "rank": doc['rank'],
                    "module": doc['metadata'].get('module', 'unknown'),
                    "feature": doc['metadata'].get('feature', 'unknown')
                }
                for doc in context_docs
            ],
            "context_count": len(context_docs)
        }


# Global instance
rag_engine = None


def initialize_rag():
    global rag_engine
    rag_engine = RAGEngine()


def query_rag(question: str) -> Dict:
    global rag_engine
    if rag_engine is None:
        initialize_rag()
    
    return rag_engine.answer_query(question)