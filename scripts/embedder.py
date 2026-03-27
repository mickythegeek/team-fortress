import json
from pathlib import Path
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# Use a lightweight embedding model
MODEL_NAME = "all-MiniLM-L6-v2"


def load_chunks(chunks_path: str) -> list:
    """Load chunks from JSON file"""
    with open(chunks_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    print(f"✓ Loaded {len(chunks)} chunks from {chunks_path}")
    return chunks


def main():
    print("🧠 Starting embedding & vectorization process...\n")
    
    # Load chunks
    chunks_path = Path("../data/chunks.json")
    if not chunks_path.exists():
        print(f"❌ Chunks file not found: {chunks_path}")
        print("   Run: python scripts/chunker.py first!")
        return
    
    chunks = load_chunks(chunks_path)
    
    # Initialize embedding model
    print(f"📥 Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    
    # Initialize ChromaDB
    vectorstore_path = Path("../data/vectorstore")
    vectorstore_path.mkdir(parents=True, exist_ok=True)
    
    client = chromadb.Client(Settings(
        chroma_db_impl="duckdb_parquet",
        persist_directory=str(vectorstore_path),
        anonymized_telemetry=False
    ))
    
    # Create or get collection
    collection = client.get_or_create_collection(
        name="interswitch_docs",
        metadata={"hnsw:space": "cosine"}
    )
    
    print(f"\n🔄 Embedding {len(chunks)} chunks...\n")
    
    # Generate embeddings and add to ChromaDB
    for i, chunk in enumerate(chunks):
        chunk_id = str(chunk['id'])
        chunk_text = chunk['text']
        
        # Generate embedding
        embedding = model.encode(chunk_text).tolist()
        
        # Add to ChromaDB
        collection.add(
            ids=[chunk_id],
            embeddings=[embedding],
            documents=[chunk_text],
            metadatas=[chunk['metadata']]
        )
        
        if (i + 1) % 10 == 0:
            print(f"   ✓ Embedded {i + 1}/{len(chunks)} chunks")
    
    # Persist to disk
    client.persist()
    
    print(f"\n✅ Embedding complete!")
    print(f"   📊 Total embeddings: {len(chunks)}")
    print(f"   💾 Vectorstore saved to: {vectorstore_path}")


if __name__ == "__main__":
    main()