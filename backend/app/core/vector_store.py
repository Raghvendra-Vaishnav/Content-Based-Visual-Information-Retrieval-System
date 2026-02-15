import faiss
import numpy as np
import os
import json
from app.config import FAISS_DIR

class FaissIndex:
    def __init__(self, dim=512):
        self.index = faiss.IndexFlatL2(dim)
        self.metadata_path = os.path.join(FAISS_DIR, "metadata.json")
        self.metadata = self._load_metadata()

    def add(self, vectors, metadata_items):
        self.index.add(np.array(vectors, dtype=np.float32))
        self.metadata.extend(metadata_items)
        self._save_metadata()

    def search(self, query, k=5):
        distances, indices = self.index.search(np.array(query, dtype=np.float32), k)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append({
                    "metadata": self.metadata[idx],
                    "distance": float(distances[0][i])
                })
        return results

    def save(self, name="index.faiss"):
        faiss.write_index(self.index, os.path.join(FAISS_DIR, name))
        self._save_metadata()

    def load(self, name="index.faiss"):
        path = os.path.join(FAISS_DIR, name)
        if os.path.exists(path):
            self.index = faiss.read_index(path)
        self.metadata = self._load_metadata()

    def _save_metadata(self):
        with open(self.metadata_path, "w") as f:
            json.dump(self.metadata, f, indent=2)

    def _load_metadata(self):
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, "r") as f:
                return json.load(f)
        return []
