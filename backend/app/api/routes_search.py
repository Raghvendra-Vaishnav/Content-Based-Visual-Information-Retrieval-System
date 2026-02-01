from fastapi import APIRouter, UploadFile, File, Form
import os
from app.models.data_models import SearchRequest, SearchResponse, SearchResult
from app.core.embedder import CLIPEmbedder
from app.core.vector_store import FaissIndex
from app.config import IMAGE_DIR

router = APIRouter()

embedder = CLIPEmbedder()
vector_store = FaissIndex(dim=512)
vector_store.load()

@router.post("/search", response_model=SearchResponse)
def search_images(request: SearchRequest):
    query_embedding = embedder.embed_text(request.query)
    results = vector_store.search(query_embedding, k=50)  # Get more results to ensure unique images

    # Group by image_path and select best (lowest distance) result per image
    grouped = {}
    for r in results:
        path = r["metadata"]["image_path"]
        if path not in grouped or r["distance"] < grouped[path]["distance"]:
            grouped[path] = r

    # Sort by distance and take top_k
    sorted_results = sorted(grouped.values(), key=lambda x: x["distance"])[:request.top_k]

    formatted = [
        SearchResult(
            image_path=os.path.basename(r["metadata"]["image_path"]),
            caption=r["metadata"]["caption"],
            distance=r["distance"]
        )
        for r in sorted_results
    ]
    return SearchResponse(results=formatted)

@router.post("/search_text", response_model=SearchResponse)
def search_by_text(request: SearchRequest):
    vector_store.load()
    query_emb = embedder.embed_text(request.query)
    results = vector_store.search(query_emb, k=50)  # Get more results to ensure unique images

    # Group by image_path and select best (lowest distance) result per image
    grouped = {}
    for r in results:
        path = r["metadata"]["image_path"]
        if path not in grouped or r["distance"] < grouped[path]["distance"]:
            grouped[path] = r

    # Sort by distance and take top_k
    sorted_results = sorted(grouped.values(), key=lambda x: x["distance"])[:request.top_k]

    return SearchResponse(results=[
        SearchResult(
            image_path=os.path.basename(r["metadata"]["image_path"]),
            caption=r["metadata"]["caption"],
            distance=r["distance"]
        )
        for r in sorted_results
    ])

@router.post("/search_image", response_model=SearchResponse)
async def search_by_image(file: UploadFile = File(...), top_k: int = Form(5)):
    vector_store.load()
    temp_path = os.path.join(IMAGE_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    img_emb = embedder.embed_image(temp_path)
    results = vector_store.search(img_emb, k=50)  # Get more results to ensure unique images

    # Group by image_path and select best (lowest distance) result per image
    grouped = {}
    for r in results:
        path = r["metadata"]["image_path"]
        if path not in grouped or r["distance"] < grouped[path]["distance"]:
            grouped[path] = r

    # Sort by distance and take top_k
    sorted_results = sorted(grouped.values(), key=lambda x: x["distance"])[:top_k]

    formatted = [
        SearchResult(
            image_path=os.path.basename(r["metadata"]["image_path"]),
            caption=r["metadata"]["caption"],
            distance=r["distance"]
        )
        for r in sorted_results
    ]
    return SearchResponse(results=formatted)

@router.post("/get_captions")
async def get_image_captions(file: UploadFile = File(...)):
    temp_path = os.path.join(IMAGE_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # Generate captions for the uploaded image
    from app.core.captioner import CaptionGenerator
    captioner = CaptionGenerator()
    captions = captioner.generate_caption(temp_path, num_captions=5)

    # Save the image permanently if not already exists
    save_path = os.path.join(IMAGE_DIR, file.filename)
    if not os.path.exists(save_path):
        os.rename(temp_path, save_path)
    else:
        save_path = temp_path  # Use temp path if file already exists

    # Get embeddings for image and each caption
    img_emb = embedder.embed_image(save_path)
    txt_embs = [embedder.embed_text(caption) for caption in captions]

    # Store image embedding
    vector_store.add(img_emb.reshape(1, -1), [{"image_path": save_path, "caption": captions[0]}])  # Use first caption as primary

    # Store text embeddings (one per caption)
    for i, (emb, cap) in enumerate(zip(txt_embs, captions)):
        vector_store.add(emb.reshape(1, -1), [{"image_path": save_path, "caption": cap}])

    vector_store.save()

    # Log captions in Flickr30k format
    from app.config import FAISS_DIR
    captions_csv_path = os.path.join(FAISS_DIR, "captions.csv")
    with open(captions_csv_path, "a", encoding="utf-8") as f:
        for i, caption in enumerate(captions):
            f.write(f"{file.filename}|{i}|{caption}\n")

    return {"captions": captions, "image_path": file.filename}

@router.get("/list_images")
def list_all_images(page: int = 1, per_page: int = 20):
    """
    List all uploaded images with pagination for lazy loading.
    Returns image paths and their primary captions.
    """
    if not os.path.exists(IMAGE_DIR):
        return {"images": [], "total": 0, "page": page, "per_page": per_page}

    # Get all image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
    all_images = []
    for filename in os.listdir(IMAGE_DIR):
        if any(filename.lower().endswith(ext) for ext in image_extensions):
            all_images.append(filename)

    # Sort by modification time (newest first)
    all_images.sort(key=lambda x: os.path.getmtime(os.path.join(IMAGE_DIR, x)), reverse=True)

    total_images = len(all_images)

    # Pagination
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    paginated_images = all_images[start_idx:end_idx]

    # Get captions for each image (use first caption from metadata if available)
    images_with_captions = []
    for img_filename in paginated_images:
        img_path = os.path.join(IMAGE_DIR, img_filename)

        # Try to find caption from metadata
        caption = "No caption available"
        for metadata in vector_store.metadata:
            if metadata["image_path"].endswith(img_filename):
                caption = metadata["caption"]
                break

        images_with_captions.append({
            "image_path": img_filename,
            "caption": caption,
            "upload_time": os.path.getmtime(img_path)
        })

    return {
        "images": images_with_captions,
        "total": total_images,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_images + per_page - 1) // per_page
    }
