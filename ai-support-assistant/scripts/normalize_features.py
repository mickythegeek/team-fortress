import re
import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "knowledge_base_raw"
CLEAN_DIR = BASE_DIR / "knowledge_base" / "features"
CLEAN_DIR.mkdir(parents=True, exist_ok=True)

def extract_field(patterns, text, default=""):
    # Accept either a single pattern or list of patterns (try each until match)
    if isinstance(patterns, str):
        patterns = [patterns]
    for p in patterns:
        try:
            match = re.search(p, text, re.IGNORECASE | re.MULTILINE)
        except re.error:
            # fallback: fix any problematic character ranges (put hyphen first)
            safe_p = p.replace("[–—-:]", "[-–—:]")
            try:
                match = re.search(safe_p, text, re.IGNORECASE | re.MULTILINE)
            except Exception:
                match = None
        if match and match.group(1):
            return match.group(1).strip()
    return default

def extract_tags(text):
    # Capture block under "## Tags" until the next heading, then parse bullets or CSV line
    match = re.search(r"##\s*Tags\s*(.+?)(?=\n##\s|\Z)", text, re.DOTALL | re.IGNORECASE)
    if not match:
        return []
    block = match.group(1).strip()
    # If bullet list
    lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
    tags = []
    for ln in lines:
        if ln.startswith("-"):
            val = ln.lstrip("-").strip().rstrip(".")
            tags.append(val.lower())
        else:
            # possibly comma-separated
            for t in re.split(r"[,\n]+", ln):
                t = t.strip().rstrip(".")
                if t:
                    tags.append(t.lower())
    # deduplicate preserving order
    seen = set()
    res = []
    for t in tags:
        if t not in seen:
            seen.add(t)
            res.append(t)
    return res

def remove_sections(text, section_titles):
    for title in section_titles:
        pattern = rf"## {re.escape(title)}.*?(?=\n## |\Z)"
        text = re.sub(pattern, "", text, flags=re.DOTALL | re.IGNORECASE)
    return text.strip()

def remove_metadata_lines(body):
    # Remove lines like "Document Type: Feature", "Module: Reporting", "AI-Ready: No", etc.
    pattern = r'(?im)^(?:Document\s+Type|Document|Type|Module|Audience|Severity|Status|AI[- ]?Ready)\s*:\s*.*$'
    return re.sub(pattern, "", body).strip()

def remove_horizontal_rules(body):
    # Remove any lines consisting only of '---' (and surrounding whitespace)
    return re.sub(r'(?m)^\s*---\s*$', '', body).strip()

def transform_step_section(body):
    # Find Step-by-Step Usage section and convert "Option X: ..." plain lines into "### Option X: ..." headings.
    m = re.search(r'(##\s*Step-By-Step Usage\b.*?)(?=\n##\s|\Z)', body, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        # also allow "Step-by-Step Usage" with different case/spaces
        m = re.search(r'(##\s*Step-By-Step Usage\b.*?)(?=\n##\s|\Z)', body, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return body
    section = m.group(0)
    head, content = section.split("\n", 1) if "\n" in section else (section, "")
    lines = content.splitlines()
    out = []
    option_re = re.compile(r'^\s*Option\s*([A-Z])\s*[:\-]\s*(.+)$', re.IGNORECASE)
    for line in lines:
        mopt = option_re.match(line)
        if mopt:
            letter = mopt.group(1).upper()
            text = mopt.group(2).strip()
            out.append(f"### Option {letter}: {text}")
        else:
            out.append(line)
    new_section = head + "\n" + "\n".join(out)
    # replace old section with new
    return body.replace(section, new_section)

def verify_rules(path, text):
    # Returns list of warnings; prints them
    warnings = []
    # Check metadata-like lines inside body
    if re.search(r'(?im)^(?:Document\s+Type|Module|Audience|Severity|Status|AI[- ]?Ready)\s*:\s*', text):
        warnings.append("metadata-like lines found in body (should be only in YAML)")
    if re.search(r'(?m)^\s*---\s*$', text):
        warnings.append("horizontal rule '---' found in body")
    # Check for Option lines that are not headings inside Step-by-Step Usage
    m = re.search(r'##\s*Step-By-Step Usage\b(.*?)(?=\n##\s|\Z)', text, flags=re.IGNORECASE | re.DOTALL)
    if m:
        content = m.group(1)
        if re.search(r'(?m)^\s*Option\s+[A-Z]\s*[:\-]\s*', content) and not re.search(r'(?m)^###\s*Option\s+[A-Z]\s*[:\-]\s*', content):
            warnings.append("Option lines found inside Step-by-Step Usage that are not converted to '###' headings")
    if warnings:
        print(f"⚠️ Warnings for {path}:")
        for w in warnings:
            print(f"  - {w}")
    return warnings

def normalize_file(path):
    raw = path.read_text(encoding="utf-8")

    title = extract_field(
        [
            r"^#\s*Feature\s*[-–—:]\s*(.+)$",  # safe: hyphen placed first
            r"^#\s*Feature\s+(.+)$",
        ],
        raw,
    )
    module = extract_field(r"Module:\s*(.*)", raw).lower()
    severity = extract_field(r"Severity:\s*(.*)", raw).lower()
    status = extract_field(r"Status:\s*(.*)", raw).lower()
    ai_ready = extract_field(r"AI-Ready:\s*(.*)", raw).lower() == "yes"

    audience_raw = extract_field(r"Audience:\s*(.*)", raw)
    audience = [a.strip().lower() for a in audience_raw.split(",") if a.strip()]

    tags = extract_tags(raw)

    # Remove noisy sections
    body = raw
    body = remove_sections(body, [
        "Module / Feature Name",
        "Audience",
        "Tags"
    ])

    # Remove header block (one-line heading + optional following blank line)
    body = re.sub(r"^#\s*Feature.*?\n\s*\n", "", body, flags=re.DOTALL | re.MULTILINE)

    # NEW: remove metadata-like lines, strip horizontal rules, and transform step options
    body = remove_metadata_lines(body)
    body = remove_horizontal_rules(body)
    body = transform_step_section(body)

    body = body.strip()

    metadata = {
        "title": title,
        "source_type": "feature",
        "module": module,
        "audience": audience,
        "severity": severity,
        "status": status,
        "last_updated": "",
        "ai_ready": ai_ready,
        "tags": tags
    }

    # Ensure REQUIRED_FIELDS exist and have sensible defaults / types
    try:
        from metadata_schema import REQUIRED_FIELDS
    except Exception:
        REQUIRED_FIELDS = ["title", "source_type", "module", "audience", "last_updated", "tags"]

    for field in REQUIRED_FIELDS:
        if field not in metadata or metadata[field] is None:
            if field in ("tags", "audience"):
                metadata[field] = []
            else:
                metadata[field] = ""

    # Normalize types and deduplicate tags
    if not isinstance(metadata["tags"], list):
        metadata["tags"] = [metadata["tags"]] if metadata["tags"] else []
    # preserve order while deduplicating
    seen = set()
    deduped = []
    for t in metadata["tags"]:
        tt = str(t).strip()
        if tt and tt not in seen:
            seen.add(tt)
            deduped.append(tt)
    metadata["tags"] = deduped

    if not isinstance(metadata["audience"], list):
        metadata["audience"] = [metadata["audience"]] if metadata["audience"] else []
    metadata["audience"] = [a.strip() for a in metadata["audience"] if a and a.strip()]

    final_text = (
        "---\n"
        + yaml.safe_dump(metadata, sort_keys=False).strip()
        + "\n---\n\n"
        + f"## Feature Overview\n{title}\n\n"
        + body
        + "\n"
    )

    output_path = CLEAN_DIR / path.name
    output_path.write_text(final_text, encoding="utf-8")
    print(f"✅ Formatted: {output_path}")

    # Verification: print warnings if the file still violates rules
    verify_rules(output_path, final_text)

    return str(output_path)

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing files")
    parser.add_argument("--inplace", action="store_true", help="Rewrite files in knowledge_base_raw instead of writing to features")
    parser.add_argument("--force", action="store_true", help="Reprocess files even if already formatted")
    args = parser.parse_args()

    print(f"Scanning: {RAW_DIR}")
    md_files = list(RAW_DIR.rglob("*.md"))
    if not md_files:
        print(f"⚠️ No markdown files found under {RAW_DIR}")
        return

    processed = []
    failed = []
    for f in md_files:
        try:
            if args.dry_run:
                print(f"[dry-run] Would format: {f}")
                processed.append(str(f))
                continue
            out = normalize_file(f)
            if out:
                # If --inplace, also write to the source file; otherwise we already wrote to CLEAN_DIR
                if args.inplace:
                    (f).write_text(Path(out).read_text(encoding="utf-8"), encoding="utf-8")
                    print(f"↺ In-place updated: {f}")
                processed.append(out)
            else:
                failed.append(str(f))
        except Exception as exc:
            print(f"❌ Failed {f}: {exc}")
            failed.append(str(f))

    print(f"Summary: processed={len(processed)}, failed={len(failed)}")
    if processed:
        print("Files written to features:")
        for p in processed:
            print(f" - {p}")
    if failed:
        print("Failed files:")
        for p in failed:
            print(f" - {p}")

if __name__ == "__main__":
    main()