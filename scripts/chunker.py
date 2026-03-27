import json
from pathlib import Path
from typing import List, Dict

# Configure chunking parameters
CHUNK_SIZE = 500  # words per chunk
CHUNK_OVERLAP = 50  # words overlap between chunks


def read_markdown_files(knowledge_base_dir: str) -> List[Dict]:
    """Read all markdown files from knowledge_base/features/"""
    markdown_files = []
    features_dir = Path(knowledge_base_dir) / "features"
    
    if not features_dir.exists():
        print(f"❌ Directory not found: {features_dir}")
        return []
    
    for md_file in features_dir.glob("*.md"):
        with open(md_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        markdown_files.append({
            "filename": md_file.name,
            "path": str(md_file),
            "content": content
        })
        print(f"✓ Loaded: {md_file.name}")
    
    return markdown_files


def extract_metadata(content: str) -> Dict:
    """Extract YAML frontmatter metadata"""
    metadata = {
        "module": "interswitch",
        "feature": "unknown",
        "source": "unknown",
        "audience": "developer"
    }
    
    if content.startswith("---"):
        try:
            _, frontmatter, _ = content.split("---", 2)
            for line in frontmatter.strip().split("\n"):
                if ":" in line:
                    key, value = line.split(":", 1)
                    metadata[key.strip()] = value.strip()
        except:
            pass
    
    return metadata


def split_into_chunks(content: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split content into overlapping chunks by word count"""
    # Remove frontmatter
    if content.startswith("---"):
        _, _, content = content.split("---", 2)
    
    words = content.split()
    chunks = []
    
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk)
    
    return chunks


def main():
    print("📚 Starting chunking process...\n")
    
    # Read markdown files
    markdown_files = read_markdown_files("../knowledge_base")
    
    if not markdown_files:
        print("❌ No markdown files found!")
        return
    
    all_chunks = []
    chunk_id = 0
    
    for md_file in markdown_files:
        print(f"\n📄 Processing: {md_file['filename']}")
        
        metadata = extract_metadata(md_file['content'])
        chunks = split_into_chunks(md_file['content'])
        
        for chunk_text in chunks:
            chunk_obj = {
                "id": chunk_id,
                "text": chunk_text,
                "source": md_file['filename'],
                "metadata": metadata
            }
            all_chunks.append(chunk_obj)
            chunk_id += 1
        
        print(f"   ✓ Created {len(chunks)} chunks from {md_file['filename']}")
    
    # Save chunks to JSON
    output_path = Path("../data/chunks.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Chunking complete!")
    print(f"   📊 Total chunks: {len(all_chunks)}")
    print(f"   💾 Saved to: {output_path}")


if __name__ == "__main__":
    main()