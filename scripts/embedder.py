import json
import os
import shutil
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
import chromadb
from chromadb.config import Settings

# Load environment variables explicitly from backend
env_path = Path(__file__).parent.parent / "web_platform" / "backend" / ".env"
load_dotenv(dotenv_path=env_path)

# Use Gemini's embedding model
MODEL_NAME = "models/gemini-embedding-001"


def load_chunks(chunks_path: str) -> list:
    """Load chunks from JSON file"""
    with open(chunks_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    print(f"✓ Loaded {len(chunks)} chunks from {chunks_path}")
    return chunks


def main():
    print("🧠 Starting embedding & vectorization process...\n")
    
    # Load chunks
    chunks_path = Path("../ai-support-assistant/data/chunks.json")
    if not chunks_path.exists():
        print(f"❌ Chunks file not found: {chunks_path}")
        print("   Run: python scripts/chunker.py first!")
        return
    
    chunks = load_chunks(chunks_path)
    
    # Initialize Gemini embedding model
    print(f"📥 Configuring Gemini embedding model: {MODEL_NAME}")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable not found.")
        return
    genai.configure(api_key=api_key)
    
    # Initialize ChromaDB — clear old data first
    vectorstore_path = Path("../ai-support-assistant/data/vectorstore")
    if vectorstore_path.exists():
        print(f"🧹 Clearing old vectorstore at {vectorstore_path}")
        shutil.rmtree(vectorstore_path)
    vectorstore_path.mkdir(parents=True, exist_ok=True)
    
    client = chromadb.PersistentClient(path=str(vectorstore_path))
    
    # Create fresh collection
    collection = client.get_or_create_collection(
        name="support_knowledge",
        metadata={"hnsw:space": "cosine"}
    )
    
    print(f"\n🔄 Embedding {len(chunks)} chunks...\n")
    
    # Generate embeddings and add to ChromaDB
    for i, chunk in enumerate(chunks):
        chunk_id = str(chunk['id'])
        chunk_text = chunk['text']
        
        # Generate embedding via Gemini
        result = genai.embed_content(
            model=MODEL_NAME,
            content=chunk_text,
            task_type="retrieval_document"
        )
        embedding = result['embedding']
        
        # Add to ChromaDB
        collection.add(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[chunk_text],
            metadatas=[chunk['metadata']]
        )
        
        if (i + 1) % 10 == 0:
            print(f"   ✓ Embedded {i + 1}/{len(chunks)} chunks")
    
    # Persist happens automatically with PersistentClient
    
    print(f"\n✅ Embedding complete!")
    print(f"   📊 Total embeddings: {len(chunks)}")
    print(f"   💾 Vectorstore saved to: {vectorstore_path}")


if __name__ == "__main__":
    main()