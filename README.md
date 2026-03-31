# FORTRESS: Copilot for Interswitch

> **A Next-Generation Developer Testing Console & Intelligence Engine specifically engineered for the Interswitch API Ecosystem.**

Built for the **Enyata Buildathon**, FORTRESS completely transforms how developers discover, integrate, and test Interswitch APIs. Instead of passively browsing documentation, developers interact with an autonomous AI Agent capable of instantly retrieving SDK knowledge, deeply securely authenticating against QA servers, and explicitly executing simulated payment pipelines directly inside the chat interface!

---

## Core Features & Compliance


### 1. Embedded Sandbox Execution (Live API Integration)
Unlike standard conversational chatbots, our AI natively executes HTTP requests against the active Interswitch QA Sandbox using intelligent **Tool Calling** intents.
- **Instant Authentication**: Tell the Copilot to `"Generate a sandbox token"`, and the Python backend dynamically securely encodes your `client_id` and fires a live OAuth Token `/passport/oauth/token` HTTP request to Interswitch's QA server, presenting the live `access_token` identically back to you inline!
- **Mock Checkout Simulation**: Ask the AI to `"Run a sample card payment request"`, and watch it sequentially utilize the token to rapidly simulate an entire API Payment completion payload without forcing developers to leave the app! 

### 2. High-Fidelity RAG Answer Engine 
To ensure maximum deterministic correctness and prevent AI hallucinations, we scraped the 6 most high-value Interswitch doc pages (Authentication, Payments, Transactions, Token Generation, Error Codes) into a highly optimized SQLite **Chroma Vector Store**. 
- The backend uses lightweight `google.generativeai` text chunk embeddings (`gemini-embedding-001`) to securely retrieve pinpoint accurate developer SDK instructions.

### 3. State-of-the-Art UX
A premium, dark-mode, glassmorphic UI aesthetic optimized heavily for Developer Experience (DX). Extremely responsive Vite/React interface that feels absolutely native and lightning fast. 

---

## 🏗️ Technical Architecture

| Stack Layer      | Technology               | Purpose |
|------------------|--------------------------|---------|
| **Frontend**     | React, Vite, TailwindCSS | Premium Copilot chat interface & Streaming UI |
| **Backend API**  | Python, FastAPI, Uvicorn | Seamless asynchronous API routing & Tool-calling Engine |
| **Intelligence** | Gemini API (`gemini-2.0-flash`), LangChain | LLM orchestration and accurate intent extraction |
| **Database**     | ChromaDB, SQLite         | Embedded persistent vector searches for documentation |

---

## 👥 Team & Contributions

This project was built entirely by a 2-man team for the Enyata Buildathon:

### Michael David — Full Stack Software Engineer
- Frontend & backend architecture
- Interswitch Sandbox live programmatic API integration and Tool-Calling orchestrations
- Node/Vercel and Render Python deployment & cloud infrastructure scaling

### Elijah Adewuyi — AI Engineer
- Advanced LLM RAG engine integration and deterministic reasoning systems
- Gemini 001 Text Embeddings generation and ChromaDB retrieval logic
- Conversational state vector alignments and prompt engineering strategy

---

## 🚀 Getting Started (Local Development)

### 1. Environment Setup
Create a `.env` in the `web_platform/backend/` directory:
```bash
GEMINI_API_KEY="your_api_key_here"
```

### 2. Prepare the Vector Database
Initialize the intelligence engine by executing the embedding pipeline:
```bash
cd scripts/
pip install -r ../ai-support-assistant/requirements.txt
python embedder.py
```

### 3. Start the Inference Server
```bash
cd web_platform/backend/
python main.py
```
*(The FastAPI server will boot up and bind securely to `http://localhost:8000`)*

### 4. Start the Frontend
```bash
cd web_platform/frontend/
npm install
npm run dev
```

---

## ☁️ Production Deployment 

The project has been heavily modularized to run natively entirely in serverless/cloud environments without heavy PyTorch dependencies.

- **Vercel**: Deploy the `/frontend` directory. Make absolutely sure to inject `VITE_API_URL` into your Vercel Environment Variables targeting your deployed backend API URL!
- **Render**: Deploy the `/backend` via `requirements.txt`. The ASGI engine will passively respect Render's dynamic `$PORT` constraints.

---

> [!NOTE] 
> **Architectural Decision:** To massively bypass Render's 512MB RAM bottleneck, the codebase was heavily refactored away from massive local `HuggingFace SentenceTransformers` toward Google's API-based zero-overhead Generative AI embedding engine. 