import requests
from bs4 import BeautifulSoup
from pathlib import Path

BASE_URL = "https://docs.interswitchgroup.com"

PAGES = [
    "/docs/home",
    "/docs/about-interswitch-apis",
    "/docs/payment-api",
    "/docs/authentication",
    "/docs/settlement",
    "/docs/webhooks",
    "/docs/error-codes",
    "/docs/api-reference",
    "/docs/quick-start",
    "/docs/integration-guide",
    "/docs/security",
    "/docs/rate-limiting",
    "/docs/transaction-flow",
    "/docs/reconciliation",
    "/docs/testing",
    "/docs/sandbox",
    "/docs/production",
    "/docs/faq",
    "/docs/support"
]

OUTPUT_DIR = Path("../knowledge_base/features")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def clean_html(html):
    """Remove scripts, styles, and navigation elements"""
    soup = BeautifulSoup(html, "html.parser")

    # remove useless elements
    for tag in soup(["script", "style", "nav", "footer"]):
        tag.decompose()

    return soup.get_text("\n")


def save_markdown(title, content, source):
    """Save content as markdown with YAML frontmatter"""
    filename = title.lower().replace(" ", "_") + ".md"

    markdown = f"""---
module: interswitch
feature: {title}
source: {source}
audience: developer
---

# {title}

{content}
"""

    with open(OUTPUT_DIR / filename, "w", encoding="utf-8") as f:
        f.write(markdown)
    
    print(f"✓ Saved: {filename}")


def main():
    print(f"Starting documentation scrape from {BASE_URL}\n")
    
    successful = 0
    failed = 0
    
    for page in PAGES:
        url = BASE_URL + page
        print(f"📥 Scraping {url}")

        try:
            res = requests.get(url, timeout=10)
            res.raise_for_status()

            text = clean_html(res.text)
            title = page.split("/")[-1].replace("-", " ").title()

            save_markdown(title, text, url)
            successful += 1
        
        except requests.exceptions.RequestException as e:
            print(f"❌ Error scraping {url}: {e}")
            failed += 1
    
    print(f"\n✅ Scraping complete!")
    print(f"   ✓ Successfully scraped: {successful} pages")
    print(f"   ❌ Failed: {failed} pages")
    print(f"   💾 Files saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()