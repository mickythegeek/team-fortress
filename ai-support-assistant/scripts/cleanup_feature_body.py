import os
import re

FEATURES_DIR = "../knowledge_base/features"

REMOVE_SECTIONS = [
    r"## \*\*Module / Feature Name\*\*[\s\S]*?(\n\n|$)",
    r"## \*\*Audience\*\*[\s\S]*?(\n\n|$)",
    r"## Tags[\s\S]*?(\n\n|$)"
]

def clean_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    for pattern in REMOVE_SECTIONS:
        content = re.sub(pattern, "", content, flags=re.MULTILINE)

    # Remove excessive separators
    content = re.sub(r"\n-{3,}\n", "\n\n", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

def main():
    for file in os.listdir(FEATURES_DIR):
        if file.endswith(".md"):
            clean_file(os.path.join(FEATURES_DIR, file))
            print(f"🧹 Cleaned: {file}")

if __name__ == "__main__":
    main()
