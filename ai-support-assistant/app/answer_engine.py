import os
import time
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
# We no longer load the key here, it's done dynamically in generate_answer

# We will instantiate the model in generate_answer

# Load system prompt
PROMPT_PATH = Path(__file__).parent / "prompts" / "system_prompt.txt"

DEFAULT_SYSTEM_PROMPT = """
You are an internal support assistant trained on an organization's system knowledge.

You answer user questions by reasoning over information available in your internal knowledge base.

CRITICAL TERMINOLOGY RULE:
- Never use the word "documentation"
- Always refer to your source of information as "my knowledge base"
- Rewrite any source phrasing that mentions documentation into "my knowledge base"

Answering principles:
- Explain processes in clear, natural language, as if guiding a colleague
- Rewrite and summarize information instead of copying wording
- Combine related ideas across multiple sources when helpful
- Present procedural explanations as well-written paragraphs
- Avoid step numbers, bullet points, asterisks, or markdown symbols
- Be accurate, professional, and easy to follow

Reasoning rules:
- If the answer is clearly supported by your knowledge base, explain it confidently
- If the answer is not explicitly stated but can be logically inferred, explain the reasoning in your own words and clearly state that the explanation is inferred
- Do not invent features, permissions, workflows, or system behavior
- Do not generate responses that cannot be supported or inferred from your knowledge base

If you do not have enough information in your knowledge base to answer confidently, say exactly:
"I do not have enough information from my database to accurately answer this question."

Never refer to external manuals, guides, or documentation.
Never say "the documentation says".
"""

SYSTEM_PROMPT = (
    PROMPT_PATH.read_text(encoding="utf-8")
    if PROMPT_PATH.exists()
    else DEFAULT_SYSTEM_PROMPT
)

# Normalize context to prevent lexical leakage
def normalize_context(text: str) -> str:
    return (
        text.replace("documentation", "knowledge base")
            .replace("Documentation", "Knowledge base")
            .replace("documented", "described in the knowledge base")
    )

def generate_answer(question: str, context_docs: list[str], max_retries: int = 3) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "An API key for Gemini must be set in your environment variables to use this feature."
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    if not context_docs:
        return "I do not have enough information from my database to accurately answer this question."

    # Treat retrieved text strictly as reference material
    context = "\n\n".join(
        f"Internal knowledge excerpt {i+1}:\n{normalize_context(doc)}"
        for i, doc in enumerate(context_docs)
    )

    prompt = f"""
{SYSTEM_PROMPT}

The following excerpts are internal knowledge references. They may need to be combined,
summarized, or logically connected. Do not repeat them verbatim.

Internal knowledge base excerpts:
{context}

User question:
{question}

Provide a clear, well-reasoned explanation in natural language:
"""

    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.35,
                    "top_p": 0.85,
                    "max_output_tokens": 500,
                }
            )
            return response.text.strip()

        except Exception as e:
            error_msg = str(e)

            if "429" in error_msg or "ResourceExhausted" in error_msg:
                if attempt < max_retries - 1:
                    wait_time = 45 * (attempt + 1)
                    print(f"Rate limited. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    return "The system is temporarily busy. Please try again in a few moments."
            else:
                return f"Error generating response: {error_msg}"

    return "Unable to generate a response at this time."
