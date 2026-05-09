#!/usr/bin/env python3
"""
Rebuild the FAISS index from metadata.json and stored image files.

The upload API stores one image embedding followed by caption embeddings for
each image. This script recreates that layout and writes fresh index/metadata
files after creating timestamped backups.
"""

import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path

import faiss
import numpy as np

sys.path.append(str(Path(__file__).parent.parent))

from app.config import FAISS_DIR
from app.core.embedder import CLIPEmbedder


def backup_file(path):
    if not os.path.exists(path):
        return None
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{path}.{stamp}.bak"
    shutil.copy2(path, backup_path)
    return backup_path


def main():
    metadata_path = os.path.join(FAISS_DIR, "metadata.json")
    index_path = os.path.join(FAISS_DIR, "index.faiss")

    if not os.path.exists(metadata_path):
        raise FileNotFoundError(f"Missing metadata file: {metadata_path}")

    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    if not metadata:
        index = faiss.IndexFlatL2(512)
        faiss.write_index(index, index_path)
        print("Created empty FAISS index; metadata is empty.")
        return

    embedder = CLIPEmbedder()
    index = faiss.IndexFlatL2(512)
    rebuilt_metadata = []
    seen_images = set()
    skipped = 0

    for item in metadata:
        image_path = item.get("image_path")
        caption = item.get("caption", "")

        if not image_path or not os.path.exists(image_path):
            skipped += 1
            continue

        if image_path not in seen_images:
            vector = embedder.embed_image(image_path)
            seen_images.add(image_path)
        else:
            vector = embedder.embed_text(caption)

        index.add(np.asarray(vector, dtype=np.float32).reshape(1, -1))
        rebuilt_metadata.append(item)

    index_backup = backup_file(index_path)
    metadata_backup = backup_file(metadata_path)

    faiss.write_index(index, index_path)
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(rebuilt_metadata, f, indent=2)

    print(f"Rebuilt FAISS index with {index.ntotal} vectors.")
    print(f"Kept {len(rebuilt_metadata)} metadata entries; skipped {skipped} missing images.")
    if index_backup:
        print(f"Index backup: {index_backup}")
    if metadata_backup:
        print(f"Metadata backup: {metadata_backup}")


if __name__ == "__main__":
    main()
