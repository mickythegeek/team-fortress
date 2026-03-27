# scripts/chunker.py
import os
import json
import frontmatter
from langchain_text_splitters import RecursiveCharacterTextSplitter


BASE_PATH = "../knowledge_base/features"
OUTPUT_PATH = "../data/chunks.json"

splitter = RecursiveCharacterTextSplitter(
    chunk_size=420,
    chunk_overlap=80,
    separators=[
        "\n## ",     # section headers
        "\n### ",
        "\n\n",
        "\n",
        " "
    ]
)

chunks = []

for file in os.listdir(BASE_PATH):
    if not file.endswith(".md"):
        continue

    post = frontmatter.load(os.path.join(BASE_PATH, file))

    split_texts = splitter.split_text(post.content)

    for idx, text in enumerate(split_texts):
        chunks.append({
            "id": f"{file}-{idx}",
            "text": text.strip(),
            "metadata": {
                **post.metadata,
                "source_file": file,
                "chunk_index": idx
            }
        })

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(chunks, f, indent=2)

print(f"✅ Created {len(chunks)} chunks")
