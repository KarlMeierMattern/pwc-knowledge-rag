## PwC Deals Knowledge RAG – Improvement Plan

### 1. Content Ingestion

- Normalize inputs (docx, pdf, json, csv) into a canonical `Document` type with metadata: `title`, `source`, `confidentiality`, `policy_type`, `effective_date`, `audience`, `region`.
- Store document metadata in `resources` table (extend schema) and enforce `insertResourceSchema` validations for size limits, MIME types, and per-user auth.
- Support structured datasets (e.g., `priority-clients.ts`) by ingesting rows into Supabase Postgres tables with column-level typing; expose ingestion jobs (BullMQ) to keep vectors synced when structured data changes.
- Version documents (hash content) to avoid duplicate embeddings and enable rollback when policies change.

### 2. Chunking & Embeddings

- Replace sentence `split(".")` with token-aware chunker (approx 400 tokens, 20% overlap) to preserve context for bullet lists/tables; add lightweight HTML/Markdown parsing before chunking.
- Store chunk-level metadata: `doc_id`, `chunk_index`, `chunk_type`, `token_range` to support provenance and structured retrieval.
- For tabular data, auto-generate synthetic natural-language summaries per row (e.g., “Remgro (CIPS) partner: Tertius van Dijk”) before embedding to improve recall.
- Add background job retry/backoff for `embedMany` failures; log to Datadog/Grafana for alerting.

### 3. Retrieval & QA

- Use hybrid search (Postgres trigram or pgvector HNSW + metadata filters) and include access-control predicates (region, clearance).
- Increase recall quality via score normalization + Top-k rerank (e.g., Cohere Rerank or OpenAI `text-embedding-3-large`), returning citations (`doc_title`, `chunk_index`, `similarity`).
- Pipe retrieved chunks through prompt templating with guardrails against prompt-injection (strip unsafe instructions, limit chunk length).
- For structured queries (e.g., “Who is the partner for Remgro?”) first hit relational tables via deterministic lookup; fall back to semantic search only when no exact match found.

### 4. API & UX

- Wrap server actions with rate limiting (Upstash/Redis) and Cloudflare WAF rules; log every query with user ID, doc IDs returned, latency.
- Extend chat route to include streaming responses, metadata chips (policy type, effective date), and “view source” links.
- Provide admin UI for uploading docs, monitoring embedding jobs, and re-running failed ingestions.

### 5. Testing, CI/CD, and Compliance

- Add Jest unit tests for chunker, embedding pipeline, and metadata validation; use Playwright to validate upload + query flows.
- Configure GitHub Actions to run lint/tests, fail on schema drift, and block deploys without updated embeddings migrations.
- Implement audit logging & retention to satisfy PwC compliance; ensure role-based access aligns with classification metadata.

### 6. Open Questions

- Should we integrate Supabase Row-Level Security or separate policy service for entitlements?
