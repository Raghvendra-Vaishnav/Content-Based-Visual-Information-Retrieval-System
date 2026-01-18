# CBVIRS Backend Documentation

## Overview

The CBVIRS (Content-Based-Visual-Information-Retrieval-System) backend is a FastAPI-based service that provides semantic image search capabilities using CLIP (Contrastive Language-Image Pretraining) embeddings and FAISS (Facebook AI Similarity Search) for efficient vector similarity search. The system supports text-to-image search, image-to-image search, and automatic image captioning.

## Architecture

### Core Components

#### 1. CLIPEmbedder (`app/core/embedder.py`)

- **Purpose**: Generates embeddings for both text and images using OpenCLIP
- **Model**: CLIP ViT-B/32
- **Key Methods**:
  - `embed_text(text: str)`: Converts text queries to 512-dimensional embeddings
  - `embed_image(image_path: str)`: Converts images to 512-dimensional embeddings

#### 2. FaissIndex (`app/core/vector_store.py`)

- **Purpose**: Manages FAISS index for efficient similarity search
- **Features**:
  - Stores embeddings with associated metadata
  - Performs k-nearest neighbor search
  - Persists index and metadata to disk
- **Key Methods**:
  - `add(vectors, metadata)`: Adds new embeddings to the index
  - `search(query, k)`: Finds k most similar vectors
  - `save()` / `load()`: Persistence operations

#### 3. CaptionGenerator (`app/core/captioner.py`)

- **Purpose**: Generates descriptive captions for images
- **Model**: BLIP (Bootstrapped Language-Image Pretraining)
- **Key Methods**:
  - `generate_caption(image_path, num_captions)`: Creates multiple captions per image

### Data Models

#### SearchRequest (`app/models/data_models.py`)

```python
{
    "query": "text search query",
    "top_k": 5  # Number of results to return
}
```

#### SearchResult (`app/models/data_models.py`)

```python
{
    "image_path": "filename.jpg",
    "caption": "generated or existing caption",
    "distance": 0.1234  # Similarity score (lower is better)
}
```

#### SearchResponse (`app/models/data_models.py`)

```python
{
    "results": [SearchResult, ...]
}
```

## API Endpoints

### 1. POST `/api/search_text`

**Purpose**: Search for images using text queries

**Request Body**:

```json
{
  "query": "a dog running in a park",
  "top_k": 5
}
```

**Response**:

```json
{
  "results": [
    {
      "image_path": "dog_park.jpg",
      "caption": "a dog is running through a park",
      "distance": 0.234
    }
  ]
}
```

**Logic**:

1. Convert text query to CLIP embedding
2. Search FAISS index for similar embeddings
3. Group results by image path (select best match per image)
4. Return top_k unique images

### 2. POST `/api/search_image`

**Purpose**: Search for similar images using an uploaded image

**Request**: Multipart form data

- `file`: Image file (JPEG, PNG, etc.)
- `top_k`: Number of results (form field)

**Response**: Same as `/api/search_text`

**Logic**:

1. Save uploaded image temporarily
2. Generate CLIP embedding for the image
3. Search FAISS index for similar embeddings
4. Group and return results as above

### 3. POST `/api/get_captions`

**Purpose**: Generate captions for an uploaded image and add it to the search index

**Request**: Multipart form data

- `file`: Image file

**Response**:

```json
{
    "captions": ["caption 1", "caption 2", ...],
    "image_path": "uploaded_image.jpg"
}
```

**Logic**:

1. Generate 5 captions using BLIP model
2. Create CLIP embeddings for image and each caption
3. Add embeddings to FAISS index
4. Save captions to CSV log file

### 4. GET `/api/list_images`

**Purpose**: List all uploaded images with pagination

**Query Parameters**:

- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20)

**Response**:

```json
{
  "images": [
    {
      "image_path": "image.jpg",
      "caption": "primary caption",
      "upload_time": 1638360000.0
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 20,
  "total_pages": 8
}
```

## Configuration

### Environment Variables

- None currently required (all paths are hardcoded)

### Directory Structure

```bash
backend/app/
├── api/
│   └── routes_search.py    # API endpoints
├── core/
│   ├── embedder.py         # CLIP embedding logic
│   ├── vector_store.py     # FAISS index management
│   └── captioner.py        # Image captioning
├── models/
│   └── data_models.py      # Pydantic models
├── storage/
│   ├── images/             # Uploaded images
│   └── faiss_index/        # FAISS index and metadata
│       ├── index.faiss
│       ├── metadata.json
│       └── captions.csv
└── config.py               # Configuration constants
```

### Constants (`app/config.py`)

```python
IMAGE_DIR = "app/storage/images"
FAISS_DIR = "app/storage/faiss_index"
```

## Installation & Setup

### Prerequisites

- Python 3.8+
- pip

### Dependencies

```bash
pip install fastapi uvicorn
pip install torch torchvision
pip install faiss-cpu
pip install open_clip_torch
pip install transformers
pip install pillow
```

### Running the Server

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Usage Examples

### Text Search

```python
import requests

response = requests.post("http://localhost:8000/api/search_text", json={
    "query": "a cat playing with a ball",
    "top_k": 3
})
results = response.json()
```

### Image Search

```python
import requests

with open("query_image.jpg", "rb") as f:
    files = {"file": f}
    data = {"top_k": "5"}
    response = requests.post("http://localhost:8000/api/search_image",
                           files=files, data=data)
results = response.json()
```

### Caption Generation

```python
import requests

with open("image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post("http://localhost:8000/api/get_captions", files=files)
captions = response.json()["captions"]
```

## Data Flow

### Indexing New Images

1. User uploads image via `/api/get_captions`
2. System generates 5 captions using BLIP
3. CLIP embeddings created for image and each caption
4. Embeddings stored in FAISS index with metadata
5. Image saved to disk, captions logged to CSV

### Searching

1. User provides text query or uploads image
2. Query converted to CLIP embedding
3. FAISS searches for k most similar stored embeddings
4. Results grouped by image path (best match per image)
5. Top results returned with metadata

## Performance Considerations

### FAISS Index

- Uses L2 distance for similarity measurement
- Index rebuilt on each addition (suitable for moderate datasets)
- For production, consider IVF or HNSW indexes for larger datasets

### Embedding Generation

- CLIP ViT-B/32: ~150ms per text embedding, ~200ms per image
- BLIP captioning: ~2-3 seconds per image
- Consider batch processing for multiple images

### Memory Usage

- CLIP model: ~1GB VRAM
- FAISS index: Scales with number of stored embeddings
- Current setup suitable for 10k-100k images

## Error Handling

### Common Error Responses

- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Image not found
- `500 Internal Server Error`: Processing failures

### Validation

- Image uploads validated for format and size
- Text queries trimmed and validated for non-empty strings
- top_k parameter clamped between 1-50

## Future Improvements

### Scalability

- Implement batch embedding generation
- Add Redis caching for frequent queries
- Consider distributed FAISS for larger datasets

### Features

- Support for multiple CLIP models
- Image preprocessing pipeline
- Advanced filtering options
- User authentication and image ownership

### Monitoring

- Add logging and metrics
- Implement health check endpoints
- Add performance monitoring

## Troubleshooting

### Common Issues

1. **FAISS loading errors**: Ensure AVX2 support or use CPU-only version
2. **CUDA out of memory**: Reduce batch sizes or use CPU inference
3. **Image processing failures**: Check image formats and file integrity

### Debug Mode

Run with `--reload` flag for automatic code reloading during development.

### Logs

Check console output for detailed error messages and processing times.
