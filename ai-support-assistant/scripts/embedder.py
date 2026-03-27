import json
from pathlib import Path
import chromadb
from sentence_transformers import SentenceTransformer

BASE_DIR = Path(__file__).resolve().parent.parent
CHUNKS_FILE = BASE_DIR / "data" / "chunks.json"
VECTOR_DIR = BASE_DIR / "data" / "vectorstore"

def normalize_metadata(meta: dict) -> dict:
    clean = {}
    for k, v in meta.items():
        if isinstance(v, list):
            clean[k] = ", ".join(str(x) for x in v)
        elif isinstance(v, dict):
            clean[k] = json.dumps(v)
        else:
            clean[k] = v
    return clean

def main():
    chunks = json.load(open(CHUNKS_FILE, encoding="utf-8"))
    model = SentenceTransformer("all-MiniLM-L6-v2")

    # ✅ THIS IS THE FIX
    client = chromadb.PersistentClient(
        path=str(VECTOR_DIR)
    )

    collection = client.get_or_create_collection("support_knowledge")

    ids, texts, metadatas = [], [], []

    for i, c in enumerate(chunks):
        text = c.get("text", "").strip()
        if not text:
            continue

        ids.append(f"chunk-{i}")
        texts.append(text)
        metadatas.append(normalize_metadata(c.get("metadata", {})))

    print(f"Embedding {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)

    collection.add(
        ids=ids,
        documents=texts,
        metadatas=metadatas,
        embeddings=embeddings.tolist()
    )

    print("✅ Embeddings stored successfully")

if __name__ == "__main__":
    main()
