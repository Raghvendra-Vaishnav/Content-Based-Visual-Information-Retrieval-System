# TODO: Visual-Semantic Search Engine Implementation

## Phase 1: Core Infrastructure Setup

- [x] Create and activate a conda Python virtual environment.
- [x] Install all dependencies from `requirements.txt`.
- [x] Configure `.env` for model paths and directories.
- [x] Implement `config.py` to centralize paths and model names.
- [x] Implement structured logging to `app/logs/app.log`.
- [x] Add `/health` route in `routes_health.py` to check server status and model readiness.

## Phase 2: Captioning & Embedding Pipeline

- [x] Implement BLIP Captioner in `app/core/captioner.py` to generate 1-3 captions per image.
- [x] Enhance CLIP Embedder in `app/core/embedder.py` for normalized embeddings.
- [x] Update Upload Endpoint in `app/api/routes_upload.py` to generate captions and embeddings.
- [x] Update FAISS Store in `app/core/vector_store.py` to handle multiple captions and metadata.

## Phase 3: Search Functionality

- [x] Implement Text Search endpoint `/search_text`.
- [x] Implement Image Search endpoint `/search_image`.
- [x] Define consistent API responses in `data_models.py`.

## Phase 4: Vector Index Management & Utilities

- [x] Create Initialization Script `scripts/init_faiss_index.py`.
- [x] Ensure index consistency and incremental updates.
- [x] Create Testing Script `scripts/test_pipeline.py` for upload-caption-embedding-search cycle.

## Phase 5: Frontend Integration

- [x] Build React Components: UploadSection, SearchBar, ResultsGrid.
- [x] Implement API calls for upload, search_text, search_image.
- [x] Add visual feedback for uploads and search results.

## Phase 6: Enhancements (Optional)

- [ ] Integrate Scene Graph using YOLO + OpenSceneGraph.
- [x] Generate multiple captions per image (N=3).
- [ ] Add performance optimizations and evaluation metrics.
- [ ] Implement persistent storage with a database.

## Phase 7: Deployment & Scaling (Future)

- [ ] Containerize backend with Dockerfile.
- [ ] Serve FastAPI + React via Nginx.
- [ ] Persist FAISS index and metadata volumes.
