# **Technical Roadmap: Visual-Semantic Search Engine**

## **Phase 1: Core Infrastructure Setup**

**Goal:** Establish a functional FastAPI backend with model loading, file storage, and FAISS indexing.

### **Tasks**

1. **Environment Setup**

   - Create and activate a conda Python virtual environment.
   - Install all dependencies from `requirements.txt`:

     ```txt
     fastapi
     uvicorn
     torch
     transformers
     timm
     ultralytics
     open_clip_torch
     faiss-cpu
     pillow
     pydantic
     python-dotenv
     ```

   - Configure `.env` for model paths and directories.

2. **Configuration & Logging**

   - Implement `config.py` to centralize:

     - Paths (`IMAGE_DIR`, `FAISS_DIR`)
     - Model names and checkpoint locations

   - Implement structured logging to `app/logs/app.log`.

3. **Health Endpoint**

   - In `routes_health.py`, add `/health` route to check server status and model readiness.

**Deliverable:**
FastAPI runs locally with `/health` responding and model paths verified.

---

## **Phase 2: Captioning & Embedding Pipeline**

**Goal:** Generate Flickr30k-style captions and embeddings for user-uploaded images.

### **Tasks**

1. **BLIP Captioner (`app/core/captioner.py`)**

   - Load `Salesforce/blip-image-captioning-large` model.
   - Write a function `generate_caption(image_path)` → returns 1–3 captions.
   - Store captions in `storage/metadata.json` and optionally log in a CSV file.

2. **CLIP Embedder (`app/core/embedder.py`)**

   - Implement both:

     - `embed_image(image_path)`
     - `embed_text(text)`

   - Return normalized embeddings for cross-modal compatibility.

3. **Upload Endpoint (`app/api/routes_upload.py`)**

   - Accept image file → save to `storage/images/`.
   - Generate caption(s) via BLIP.
   - Compute embeddings via CLIP (both image + caption).
   - Add entries to FAISS (via `vector_store.py`).
   - Append metadata:

     ```json
     {
       "image_path": "...",
       "captions": ["..."],
       "embedding_id": ...
     }
     ```

4. **FAISS Store (`app/core/vector_store.py`)**

   - Implement index creation, addition, saving, and loading.
   - Maintain synchronized `metadata.json` (image path ↔ caption).

**Deliverable:**
Uploading an image automatically generates a caption and embedding, and persists both locally.

---

## **Phase 3: Search Functionality**

**Goal:** Enable semantic search by text or image.

### **Tasks**

1. **Text Search (`/search_text`)**

   - Accept a text query.
   - Embed query using CLIP.
   - Search top-k similar images in FAISS.
   - Return metadata (image paths + captions + similarity scores).

2. **Image Search (`/search_image`)**

   - Accept an uploaded image.
   - Compute embedding and query FAISS for nearest neighbors.
   - Return top-k visually similar images.

3. **Response Formatting**

   - Use `data_models.py` to define consistent API responses:

     ```python
     class SearchResult(BaseModel):
         image_path: str
         caption: str
         distance: float
     ```

**Deliverable:**
Two functional endpoints `/search_text` and `/search_image` return top matches with metadata.

---

## **Phase 4: Vector Index Management & Utilities**

**Goal:** Ensure robustness and maintainability of FAISS index and metadata.

### **Tasks**

1. **Initialization Script (`scripts/init_faiss_index.py`)**

   - Create empty FAISS index if not found.
   - Load existing metadata if available.

2. **Index Consistency**

   - Add checks for alignment between FAISS entries and metadata.
   - Handle incremental addition of new images.

3. **Testing (`scripts/test_pipeline.py`)**

   - Test upload → caption → embedding → search cycle with sample images.

**Deliverable:**
Stable FAISS index that supports incremental updates and consistent metadata management.

---

## **Phase 5: Frontend Integration**

**Goal:** Connect your Vite/React frontend to FastAPI endpoints.

### **Tasks**

1. **React Components**

   - `UploadSection`: upload image, display generated caption.
   - `SearchBar`: input text query.
   - `ResultsGrid`: display search results (thumbnails + captions).

2. **API Calls**

   - `/api/upload` → POST image → receive caption + metadata.
   - `/api/search_text` → POST text → receive search results.
   - `/api/search_image` → POST image → receive similar images.

3. **Visual Feedback**

   - Display search results with similarity scores.
   - Add image preview for upload and returned results.

**Deliverable:**
A working UI that lets you upload images and query semantically by text or image.

---

## **Phase 6: Enhancements (Optional)**

**Goal:** Enrich semantic understanding and improve retrieval quality.

### **Extensions**

1. **Scene Graph Integration**

   - Use YOLO + OpenSceneGraph to extract spatial relationships.
   - Generate structured captions like “dog running behind red car.”

2. **Multiple Captions per Image**

   - Generate N=3 captions for diversity.
   - Store all in `captions.csv` (Flickr30k-style).

3. **Performance & Quality**

   - Implement batch embedding updates.
   - Cache frequent searches.
   - Add evaluation metrics (Recall@K, mAP).

4. **Persistent Storage**

   - Add a lightweight database (SQLite or PostgreSQL) for image metadata.

---

## **Phase 7: Deployment & Scaling (Future)**

**Goal:** Prepare for production or remote hosting.

### **Tasks**

- Containerize backend (Dockerfile).
- Serve FastAPI + React via Nginx.
- Persist FAISS index and metadata volumes.
- Optionally switch to managed vector DB (Milvus, Pinecone).

---

## **Milestone Summary**

| Phase | Focus               | Deliverable                      |
| ----- | ------------------- | -------------------------------- |
| 1     | Setup               | FastAPI skeleton + model configs |
| 2     | Caption + Embedding | BLIP + CLIP pipeline             |
| 3     | Search              | Text & image retrieval           |
| 4     | Index mgmt          | Stable FAISS + metadata sync     |
| 5     | Frontend            | React integration                |
| 6     | Enrichment          | Scene graph, multi-caption       |

---
