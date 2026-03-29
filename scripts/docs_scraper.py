"""
Smart Interswitch Documentation Scraper
Fetches 8 high-value pages from docs.interswitchgroup.com,
cleans the content (strips nav/sidebar), saves as clean markdown.
"""
import requests
import re
from bs4 import BeautifulSoup
from pathlib import Path

BASE_URL = "https://docs.interswitchgroup.com"

# High-value pages that answer 80% of judge questions
PAGES = {
    "api_overview": {
        "path": "/docs/about-interswitch-apis",
        "title": "Interswitch API Overview - The Basics",
        "feature": "api-overview"
    },
    "authentication": {
        "path": "/docs/authentication",
        "title": "Authentication - OAuth 2.0 and InterswitchAuth",
        "feature": "authentication"
    },
    "quickstart": {
        "path": "/docs/quickstart-accept-your-first-payment-in-5-minutes",
        "title": "QuickStart - Accept Your First Payment in 5 Minutes",
        "feature": "quickstart"
    },
    "accept_payments_overview": {
        "path": "/docs/overview",
        "title": "Accept Payments Overview - Quickteller Business",
        "feature": "accept-payments"
    },
    "card_payments_api": {
        "path": "/docs/payment-api",
        "title": "Card Payments API",
        "feature": "card-payments"
    },
    "web_checkout": {
        "path": "/docs/web-checkout",
        "title": "Web Checkout Integration",
        "feature": "web-checkout"
    },
    "webhooks": {
        "path": "/docs/webhooks",
        "title": "Webhooks - Real-time Notifications",
        "feature": "webhooks"
    },
    "response_codes": {
        "path": "/docs/payment-response-codes",
        "title": "Payment Response Codes and Transaction Status",
        "feature": "response-codes"
    }
}

OUTPUT_DIR = Path("../ai-support-assistant/knowledge_base/features")


def extract_article_content(html: str) -> str:
    """Extract only the main article body, stripping nav/sidebar/footer noise."""
    soup = BeautifulSoup(html, "html.parser")
    
    # Remove all nav, sidebar, header, footer elements
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    
    # ReadMe.io docs use specific content containers
    # Try to find the main content area
    article = soup.find("article") or soup.find("div", class_="markdown-body") or soup.find("div", id="content")
    
    if article:
        content = article
    else:
        # Fallback: get the body and strip common sidebar patterns
        content = soup.find("body") or soup
    
    # Get text, preserving some structure
    text = content.get_text("\n", strip=False)
    
    # Clean up: remove excessive whitespace and nav-like lines
    lines = text.split("\n")
    cleaned_lines = []
    skip_patterns = [
        "Jump to Content",
        "Start typing to search",
        "Developer Console",
        "Developer Community", 
        "Updated ",
        "API Reference",
        "SDKs and Plugins",
    ]
    
    seen_content = False
    nav_link_pattern = re.compile(r'^\s*[\[\(].*[\]\)]\s*$')
    
    for line in lines:
        stripped = line.strip()
        
        # Skip empty lines at the start
        if not stripped and not seen_content:
            continue
        
        # Skip nav-like patterns
        if any(p in stripped for p in skip_patterns):
            continue
        
        # Skip lines that are just link references (sidebar nav items)  
        if stripped.startswith("[") and stripped.endswith(")"):
            continue
        
        # Skip very short lines that look like sidebar items
        if len(stripped) < 3:
            continue
            
        seen_content = True
        cleaned_lines.append(line)
    
    result = "\n".join(cleaned_lines)
    
    # Remove duplicate code blocks (ReadMe.io often shows them twice)
    # Pattern: same code block appearing back-to-back
    result = re.sub(r'(```[^`]*```)\s*\n\s*\1', r'\1', result)
    
    return result.strip()


def save_markdown(key: str, page_info: dict, content: str):
    """Save as clean markdown with YAML frontmatter."""
    filename = f"{key}.md"
    url = BASE_URL + page_info["path"]
    
    markdown = f"""---
module: interswitch
feature: {page_info['feature']}
source: {url}
audience: developer
title: {page_info['title']}
---

# {page_info['title']}

{content}
"""
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filepath = OUTPUT_DIR / filename
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)
    
    word_count = len(content.split())
    print(f"  ✓ Saved: {filename} ({word_count} words)")
    return word_count


def main():
    print("🚀 Interswitch Documentation Scraper v2")
    print(f"   Target: {len(PAGES)} high-value pages\n")
    
    # Clear old scraped files first
    if OUTPUT_DIR.exists():
        old_files = list(OUTPUT_DIR.glob("*.md"))
        if old_files:
            print(f"🧹 Clearing {len(old_files)} old files...")
            for f in old_files:
                f.unlink()
            print()
    
    total_words = 0
    successful = 0
    failed = 0
    
    for key, page_info in PAGES.items():
        url = BASE_URL + page_info["path"]
        print(f"📥 Scraping: {page_info['title']}")
        print(f"   URL: {url}")
        
        try:
            res = requests.get(url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            res.raise_for_status()
            
            content = extract_article_content(res.text)
            
            if len(content.split()) < 20:
                print(f"  ⚠ Very little content extracted ({len(content.split())} words)")
            
            words = save_markdown(key, page_info, content)
            total_words += words
            successful += 1
            
        except requests.exceptions.RequestException as e:
            print(f"  ❌ Error: {e}")
            failed += 1
        
        print()
    
    print("=" * 50)
    print(f"✅ Scraping complete!")
    print(f"   📄 Pages scraped: {successful}/{len(PAGES)}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📊 Total words: {total_words:,}")
    print(f"   💾 Output: {OUTPUT_DIR}")
    print()
    print("Next steps:")
    print("   python chunker.py     # Chunk the documents")
    print("   python embedder.py    # Embed into ChromaDB")


if __name__ == "__main__":
    main()