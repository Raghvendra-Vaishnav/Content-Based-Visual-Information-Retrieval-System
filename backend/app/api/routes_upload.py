from fastapi import APIRouter, UploadFile, File
import os
from app.core.captioner import CaptionGenerator
from app.core.embedder import CLIPEmbedder
from app.core.vector_store import FaissIndex
from app.config import IMAGE_DIR, FAISS_DIR

router = APIRouter()

captioner = CaptionGenerator()
embedder = CLIPEmbedder()
faiss_store = FaissIndex(dim=512)

@router.post("/upload_with_caption")
async def upload_and_caption(files: list[UploadFile] = File(...)):
    results = []
    for file in files:
        # Save image
        save_path = os.path.join(IMAGE_DIR, file.filename)
        with open(save_path, "wb") as f:
            f.write(await file.read())

        # Generate captions (5 like Flickr30k)
        captions = captioner.generate_caption(save_path, num_captions=5)

        # Get embeddings for image and each caption
        img_emb = embedder.embed_image(save_path)
        txt_embs = [embedder.embed_text(caption) for caption in captions]

        # Store image embedding
        faiss_store.add(img_emb.reshape(1, -1), [{"image_path": save_path, "caption": captions[0]}])  # Use first caption as primary

        # Store text embeddings (one per caption)
        for i, (emb, cap) in enumerate(zip(txt_embs, captions)):
            faiss_store.add(emb.reshape(1, -1), [{"image_path": save_path, "caption": cap}])

        faiss_store.save()

        # Log captions in Flickr30k format
        captions_csv_path = os.path.join(FAISS_DIR, "captions.csv")
        with open(captions_csv_path, "a", encoding="utf-8") as f:
            for i, caption in enumerate(captions):
                f.write(f"{file.filename}|{i}|{caption}\n")

        results.append({"captions": captions, "image_path": file.filename})

    return results
