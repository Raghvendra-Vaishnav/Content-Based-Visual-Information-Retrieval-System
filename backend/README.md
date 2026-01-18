# Backend

```Conceptual Architecture
            ┌─────────────────────────────────────────┐
            │              Upload Image               │
            └─────────────────────────────────────────┘
                                │
                                ▼
           ┌───────────────────────────────────────────┐
           │  Caption Generation (BLIP / CLIP Caption) │
           └───────────────────────────────────────────┘
                                │
                                ▼
           ┌───────────────────────────────────────────┐
           │  Embedding Generation (CLIP)              │
           │  • image → embedding_i                    │
           │  • caption → embedding_t                  │
           └───────────────────────────────────────────┘
                                │
                                ▼
           ┌───────────────────────────────────────────┐
           │  Vector Store (FAISS)                     │
           │  • store embeddings + metadata            │
           └───────────────────────────────────────────┘
                                │
                                ▼
           ┌───────────────────────────────────────────┐
           │  Search API                               │
           │  • text → retrieve similar images         │
           │  • image → retrieve similar images        │
           └───────────────────────────────────────────┘

```

## Run Script

```bash
cd backend/
source venv/Scripts/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
