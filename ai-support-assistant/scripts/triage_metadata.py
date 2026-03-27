import os
import csv
import sys
from pathlib import Path
from datetime import date

try:
	import frontmatter
except Exception:
	print("❌ Missing dependency 'python-frontmatter'. Install with: pip install python-frontmatter")
	sys.exit(2)

try:
	from metadata_schema import REQUIRED_FIELDS, SOURCE_TYPES
except Exception:
	REQUIRED_FIELDS = ["title", "source_type", "module", "audience", "last_updated", "tags"]
	SOURCE_TYPES = ["feature", "error", "sop"]

BASE_DIR = Path(__file__).resolve().parent.parent
FEATURES_DIR = BASE_DIR / "knowledge_base" / "features"
REPORT_PATH = BASE_DIR / "scripts" / "triage_report.csv"

def classify(missing, meta, fname):
	# Bucket A: only missing last_updated
	if missing == ["last_updated"]:
		return "A", "Auto-fill last_updated"
	# Bucket B: missing structural fields
	if any(k in missing for k in ("module", "audience", "tags")):
		return "B", "Set module/audience/tags manually"
	# Bucket C: likely wrong doc type (report/mixed) or missing title/source_type
	title = str(meta.get("title", "")).lower()
	if "report" in title or "report" in fname.lower() or "title" in missing or "source_type" in missing:
		return "C", "Review doc type and consider moving/splitting"
	# Fallback B
	return "B", "Manual review"

def is_missing(meta, key):
	val = meta.get(key, None)
	return val in (None, "", [], {})

def run(dry_run=False, fix_last_updated=False, apply_defaults=False, out_csv=REPORT_PATH,
        set_last_updated=None, apply_to_bucket="A", backup=False, list_bucket=None):
    files = sorted(FEATURES_DIR.rglob("*.md"))
    if not files:
        print(f"⚠️ No files found in {FEATURES_DIR}")
        return 1

    rows = []
    counts = {"A":0,"B":0,"C":0,"OK":0}
    bucket_map = {"A": [], "B": [], "C": [], "OK": []}

    # Validate date if provided
    if set_last_updated:
        try:
            target_date = date.fromisoformat(set_last_updated)
        except Exception:
            print(f"❌ Invalid date format for --set-last-updated: {set_last_updated} (use YYYY-MM-DD)")
            return 2

    for p in files:
        try:
            post = frontmatter.load(p)
        except Exception as exc:
            rows.append((str(p), "ERROR", f"parse_error: {exc}", "", ""))
            continue
        meta = post.metadata or {}
        missing = [k for k in REQUIRED_FIELDS if is_missing(meta, k)]
        if not missing:
            bucket = "OK"
            action = "none"
            counts["OK"] += 1
        else:
            bucket, action = classify(missing, meta, p.name)
            counts[bucket] += 1

        rows.append((str(p), bucket, ";".join(missing), action, meta.get("source_type","")))
        bucket_map.setdefault(bucket, []).append(p)

        # If user only wants to list a bucket, skip modifications
        if list_bucket:
            continue

        # apply safe fixes (existing)
        if not dry_run:
            changed = False
            if fix_last_updated and bucket == "A":
                meta["last_updated"] = date.today().isoformat()
                changed = True
            if set_last_updated and (apply_to_bucket == "ALL" or bucket == apply_to_bucket):
                meta["last_updated"] = target_date.isoformat()
                changed = True
            if apply_defaults and bucket == "B":
                if "module" in missing:
                    meta.setdefault("module", "UNKNOWN")
                    changed = True
                if "audience" in missing:
                    meta.setdefault("audience", [])
                    changed = True
                if "tags" in missing:
                    meta.setdefault("tags", [])
                    changed = True
            if changed:
                if backup:
                    bak = p.with_name(p.name + ".bak")
                    with open(bak, "w", encoding="utf-8") as fh:
                        fh.write(open(p, "r", encoding="utf-8").read())
                post.metadata = meta
                with open(p, "w", encoding="utf-8") as fh:
                    fh.write(frontmatter.dumps(post))

    # write csv
    with open(out_csv, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["filepath","bucket","missing_fields","suggested_action","source_type"])
        w.writerows(rows)

    # If listing a bucket, print files and exit
    if list_bucket:
        lb = list_bucket.upper()
        print(f"Files in bucket {lb}:")
        for p in bucket_map.get(lb, []):
            print(f" - {p}")
        print(f"Summary: OK={counts['OK']} A={counts['A']} B={counts['B']} C={counts['C']}")
        return 0

    print(f"Triage complete. Report: {out_csv}")
    print(f"Summary: OK={counts['OK']} A={counts['A']} B={counts['B']} C={counts['C']}")
    return 0

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Do not write changes; just report")
    parser.add_argument("--fix-last-updated", action="store_true", help="Auto-fill last_updated for Bucket A files (today)")
    parser.add_argument("--apply-defaults", action="store_true", help="Fill safe defaults for Bucket B files (module=UNKNOWN, empty audience/tags)")
    parser.add_argument("--output", default=str(REPORT_PATH), help="CSV output path")
    parser.add_argument("--set-last-updated", help="Set last_updated to YYYY-MM-DD for files in the target bucket")
    parser.add_argument("--apply-to-bucket", choices=["A","B","C","OK","ALL"], default="A", help="Which bucket to apply --set-last-updated to")
    parser.add_argument("--backup", action="store_true", help="Create .bak copies before modifying files")
    parser.add_argument("--list-bucket", choices=["A","B","C","OK"], help="List files in the specified bucket and exit (no changes)")
    args = parser.parse_args()

    exit_code = run(
        dry_run=args.dry_run,
        fix_last_updated=args.fix_last_updated,
        apply_defaults=args.apply_defaults,
        out_csv=Path(args.output),
        set_last_updated=args.set_last_updated,
        apply_to_bucket=args.apply_to_bucket,
        backup=args.backup,
        list_bucket=args.list_bucket,
    )
    sys.exit(exit_code)

if __name__ == "__main__":
	main()
