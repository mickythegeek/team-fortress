from pathlib import Path
import chromadb
from sentence_transformers import SentenceTransformer
from answer_engine import generate_answer

print("🚀 RAG pipeline starting...")

BASE_DIR = Path(__file__).resolve().parent.parent
VECTOR_DIR = BASE_DIR / "data" / "vectorstore"

# Same model used during embedding
model = SentenceTransformer("all-MiniLM-L6-v2")

# Persistent Chroma client
client = chromadb.PersistentClient(
    path=str(VECTOR_DIR)
)

# Must already exist (created by embedder)
collection = client.get_collection("support_knowledge")

print("📦 Collection count:", collection.count())

def ask(question: str):
    # Embed the user question
    query_embedding = model.encode(question).tolist()

    # Retrieve relevant docs
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    docs = results.get("documents", [[]])[0]

    if not docs:
        print("\n⚠️ No relevant documentation found.")
        return

    # Generate grounded answer
    answer = generate_answer(question, docs)

    print("\n🧠 Fortress AI Answer:\n")
    print(answer)

if __name__ == "__main__":
    while True:
        q = input("\nAsk Fortress AI (or 'exit'): ")
        if q.lower() == "exit":
            break
        ask(q)