import os
import time
import requests
import json
import base64
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

Proactive Sandbox Testing:
- We have the ability to execute live Sandbox tests against the Interswitch Authentication, Card Payment, and Transaction Query endpoints on behalf of the user.
- If the user asks about authentication, ALWAYS proactively ask: "Would you like me to generate a live sandbox Access Token for you to test?"
- If the user asks about card payments, ALWAYS proactively ask: "Would you like me to run a sample card payment request in the sandbox for you?"
- If the user asks why a transaction failed or provides a reference to check, the system will execute a live query resulting in a [LIVE SANDBOX RESULT]. YOU MUST analyze this result.
- For Transaction Queries, analyze the `ResponseCode` (e.g., 00 = Approved, 51 = Insufficient Funds, Z0 = Not Permitted) and explain it. If it says "not found", state that.

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

def execute_sandbox_auth() -> str:
    """Executes a live API call to fetch a real OAuth Access Token from the Interswitch QA Sandbox using user secrets."""
    import os
    # Default to the sandbox generic test combo if user hasn't supplied their own in the .env
    client_id = os.getenv("INTERSWITCH_CLIENT_ID", "IKIAB23A4E2756605C1ABC33CE3C287E27267F660D61")
    secret = os.getenv("INTERSWITCH_SECRET_KEY", "secret")
    
    auth_str = f"{client_id}:{secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()
    
    token_url = "https://qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials"
    token_headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        token_res = requests.post(token_url, data={"grant_type": "client_credentials"}, headers=token_headers)
        token_res.raise_for_status()
        return json.dumps(token_res.json(), indent=2)
    except Exception as e:
        return f'{{\n  "error": "Failed to generate Token: {str(e)}"\n}}'

def execute_sandbox_card_payment() -> str:
    """Executes a 100% LIVE Card Payment Execution against the Interswitch QA Sandbox."""
    try:
        # Step 1: Securely Fetch Token exactly like the auth flow
        import os
        client_id = os.getenv("INTERSWITCH_CLIENT_ID", "IKIAB23A4E2756605C1ABC33CE3C287E27267F660D61")
        secret = os.getenv("INTERSWITCH_SECRET_KEY", "secret")
        
        b64_auth = base64.b64encode(f"{client_id}:{secret}".encode()).decode()
        token_url = "https://qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials"
        token_headers = {
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        token_res = requests.post(token_url, data={"grant_type": "client_credentials"}, headers=token_headers)
        token_res.raise_for_status()
        token = token_res.json().get("access_token")
        
        # Step 2: Hit the Live Pay-Bill or Payment Endpoint
        url = "https://qa.interswitchng.com/collections/api/v1/pay-bill"
        payload = {
            "merchantCode": "MX6072",
            "payableCode": "9405967",
            "amount": "10000",
            "redirectUrl": "https://localhost:8780/payment-success",
            "customerId": "v@example.com",
            "currencyCode": "566",
            "customerEmail": "v@example.com"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        # It's an authentic external execution. If Interswitch 405s, the system will accurately reflect exactly what happened.
        p_res = requests.post(url, json=payload, headers=headers)
        
        if p_res.status_code != 200:
             return f'{{\n  "status": "server_error",\n  "http_code": {p_res.status_code},\n  "server_response": {p_res.text}\n}}'
             
        return json.dumps(p_res.json(), indent=2)

    except Exception as e:
        return f'{{\n  "status": "failed",\n  "error": "Failed to execute Live Sandbox Endpoint: {str(e)}"\n}}'

def execute_transaction_query(transaction_reference: str) -> str:
    """Executes a 100% LIVE Transaction Query against the Interswitch QA Sandbox."""
    try:
        import os
        client_id = os.getenv("INTERSWITCH_CLIENT_ID", "IKIAB23A4E2756605C1ABC33CE3C287E27267F660D61")
        secret = os.getenv("INTERSWITCH_SECRET_KEY", "secret")
        
        b64_auth = base64.b64encode(f"{client_id}:{secret}".encode()).decode()
        token_url = "https://qa.interswitchng.com/passport/oauth/token?grant_type=client_credentials"
        token_headers = {
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        token_res = requests.post(token_url, data={"grant_type": "client_credentials"}, headers=token_headers)
        token_res.raise_for_status()
        token = token_res.json().get("access_token")
        
        url = f"https://qa.interswitchng.com/collections/api/v1/gettransaction.json?merchantcode=MX6072&transactionreference={transaction_reference}&amount=10000"
        
        headers = {
            "Authorization": f"Bearer {token}"
        }
        
        t_res = requests.get(url, headers=headers)
        
        if t_res.status_code != 200:
             return f'{{\n  "status": "query_failed",\n  "http_code": {t_res.status_code},\n  "server_response": {t_res.text}\n}}'
             
        return json.dumps(t_res.json(), indent=2)

    except Exception as e:
        return f'{{\n  "status": "failed",\n  "error": "Failed to query Transaction Endpoint: {str(e)}"\n}}'

def generate_answer(question: str, context_docs: list[str], max_retries: int = 3) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "GEMINI_API_KEY is not configured in the environment."
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    # Detect Sandbox Execution Intent for Auth, Payment, and Transaction Queries
    q_lower = question.lower()
    sandbox_result = None
    
    auth_keywords = [
        "generate a sandbox token", "test auth", "test token", "generate a token", 
        "generate token", "generate access token"
    ]
    card_keywords = [
        "card payment request", "sample card payment", "run card payment", "test card payment", "run a sample"
    ]
    general_yes = ["yes", "run it", "test it", "live sandbox"]

    import re
    
    # Strictly require REF, REFERENCE, or TRANSACTION prefix
    ref_match = re.search(r'\b(?:REF|REFERENCE|TRANSACTION)\s*[:#-]?\s*([A-Z0-9_-]{5,50})\b', question.upper())
        
    debug_keywords = ["check", "status", "debug", "failed", "query", "what happened", "why did"]
    is_debug_request = any(re.search(rf"\b{k}\b", q_lower) for k in debug_keywords)

    if ref_match and is_debug_request:
        ref = ref_match.group(1)
        if ref not in ["TRANSACTION", "REFERENCE"]:
            print(f"⚡ Live Transaction Query Execution Triggered for REF: {ref}!")
            sandbox_result = execute_transaction_query(ref)
    elif any(keyword in q_lower for k in card_keywords for keyword in card_keywords):
        print("⚡ Live Card Payment Execution Triggered!")
        sandbox_result = execute_sandbox_card_payment()
    elif any(keyword in q_lower for keyword in auth_keywords):
        print("⚡ Live Authorization Execution Triggered!")
        sandbox_result = execute_sandbox_auth()
    elif any(keyword in q_lower for keyword in general_yes) and "card" in q_lower:
        print("⚡ Live Card Payment Execution Triggered!")
        sandbox_result = execute_sandbox_card_payment()
    elif any(keyword in q_lower for keyword in general_yes):
        # Default to auth if just "yes" without context
        print("⚡ Live Authorization Execution Triggered!")
        sandbox_result = execute_sandbox_auth()

    # Prevent empty contexts from crashing standard queries, but ALways allow sandbox executions
    if not context_docs and not sandbox_result:
        return "I do not have enough information from my database to accurately answer this question."

    if sandbox_result:
        return f"I have seamlessly injected a live Sandbox request using your personal merchant credentials!\n\nHere is what the Interswitch QA server returned for your request:\n```json\n{sandbox_result}\n```"
        
    # Treat retrieved text strictly as reference material
    context_blocks = [
        f"Internal knowledge excerpt {i+1}:\n{normalize_context(doc)}"
        for i, doc in enumerate(context_docs)
    ]
    context = "\n\n".join(context_blocks)

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
