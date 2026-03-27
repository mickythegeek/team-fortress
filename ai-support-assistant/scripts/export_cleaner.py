import os
import sys

try:
    import frontmatter
except Exception as e:
    print("❌ Missing dependency 'python-frontmatter'. Install with: pip install python-frontmatter")
    sys.exit(2)

try:
    from metadata_schema import REQUIRED_FIELDS
except Exception:
    REQUIRED_FIELDS = ["title", "source_type", "module", "audience", "last_updated", "tags"]

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "knowledge_base", "features"))

if not os.path.isdir(BASE_DIR):
    print(f"❌ Features directory not found: {BASE_DIR}")
    sys.exit(2)

failed_files = []

for root, _, files in os.walk(BASE_DIR):
    for fname in sorted(files):
        if not fname.endswith(".md"):
            continue
        path = os.path.join(root, fname)
        try:
            post = frontmatter.load(path)
        except Exception as exc:
            print(f"❌ {os.path.relpath(path, BASE_DIR)} parse error: {exc}")
            failed_files.append(path)
            continue

        missing = []
        for key in REQUIRED_FIELDS:
            val = post.metadata.get(key, None)
            if val in (None, "", [], {}):
                missing.append(key)
        if missing:
            print(f"❌ {os.path.relpath(path, BASE_DIR)} missing: {missing}")
            failed_files.append(path)
        else:
            print(f"✅ {os.path.relpath(path, BASE_DIR)} validated")

print()
if failed_files:
    print(f"Summary: {len(failed_files)} file(s) failed validation.")
    sys.exit(1)
else:
    print("Summary: all files validated.")
    sys.exit(0)
