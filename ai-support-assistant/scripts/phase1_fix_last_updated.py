import sys
from pathlib import Path
from datetime import date
import argparse

try:
    from triage_metadata import run, REPORT_PATH
except Exception as exc:
    print("❌ Could not import triage_metadata.run - ensure scripts/triage_metadata.py is present and importable.")
    print(exc)
    sys.exit(2)

def main():
    parser = argparse.ArgumentParser(description="Phase 1: bulk-set last_updated=2026-01-14 for Bucket A files (only missing last_updated).")
    parser.add_argument("--date", default="2026-01-14", help="Date to set as last_updated (YYYY-MM-DD). Default: 2026-01-14")
    parser.add_argument("--dry-run", action="store_true", help="Preview the files that would be modified (no writes)")
    parser.add_argument("--backup", action="store_true", help="Create .bak backups before modifying files")
    parser.add_argument("--output", default=str(REPORT_PATH), help="CSV report path (default: scripts/triage_report.csv)")
    args = parser.parse_args()

    print(f"Phase 1: setting last_updated={args.date} for Bucket A files (only those missing last_updated).")
    print("Dry run:" if args.dry_run else "Applying changes...")

    # call triage run: set_last_updated applies to bucket specified by apply_to_bucket
    rc = run(
        dry_run=args.dry_run,
        fix_last_updated=False,
        apply_defaults=False,
        out_csv=Path(args.output),
        set_last_updated=args.date,
        apply_to_bucket="A",
        backup=args.backup,
        list_bucket=None,
    )

    if rc == 0:
        print("Phase 1 complete. Review the report at:", args.output)
        print("Validate with: python scripts/export_cleaner.py")
    else:
        print("Phase 1 encountered issues. See output above.")
    sys.exit(rc)

if __name__ == "__main__":
    main()
