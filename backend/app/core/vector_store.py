import faiss
import numpy as np
import os
import json
from app.config import FAISS_DIR

class FaissIndex:
    def __init__(self, dim=512, auto_load=True):
        self.dim = dim
        self.index_path = os.path.join(FAISS_DIR, "index.faiss")
        self.metadata_path = os.path.join(FAISS_DIR, "metadata.json")
        self.index = self._create_index()
        self.metadata = []
        if auto_load:
            self.load()
        else:
            self.metadata = self._load_metadata()

    def add(self, vectors, metadata_items):
        vectors = self._prepare_vectors(vectors)
        if len(metadata_items) != vectors.shape[0]:
            raise ValueError("Number of metadata items must match number of vectors")
        self._ensure_consistent()
        self.index.add(vectors)
        self.metadata.extend(metadata_items)
        self._save_metadata()

    def search(self, query, k=5):
        self._ensure_consistent()
        if self.index.ntotal == 0:
            return []
        query = self._prepare_vectors(query)
        distances, indices = self.index.search(query, min(k, self.index.ntotal))
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.metadata):
                results.append({
                    "metadata": self.metadata[idx],
                    "distance": float(distances[0][i])
                })
        return results

    def save(self, name="index.faiss"):
        self._ensure_consistent()
        faiss.write_index(self.index, os.path.join(FAISS_DIR, name))
        self._save_metadata()

    def load(self, name="index.faiss"):
        path = os.path.join(FAISS_DIR, name)
        if os.path.exists(path):
            self.index = faiss.read_index(path)
            if self.index.d != self.dim:
                raise ValueError(f"FAISS index dimension {self.index.d} does not match expected {self.dim}")
        else:
            self.index = self._create_index()
        self.metadata = self._load_metadata()
        self._ensure_consistent()

    def _save_metadata(self):
        with open(self.metadata_path, "w") as f:
            json.dump(self.metadata, f, indent=2)

    def _load_metadata(self):
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, "r") as f:
                return json.load(f)
        return []

    def _create_index(self):
        return faiss.IndexFlatL2(self.dim)

    def _prepare_vectors(self, vectors):
        vectors = np.asarray(vectors, dtype=np.float32)
        if vectors.ndim == 1:
            vectors = vectors.reshape(1, -1)
        if vectors.ndim != 2 or vectors.shape[1] != self.dim:
            raise ValueError(f"Expected vectors with shape (n, {self.dim}), got {vectors.shape}")
        return vectors

    def _ensure_consistent(self):
        if self.index.ntotal != len(self.metadata):
            raise RuntimeError(
                "FAISS index and metadata are out of sync: "
                f"{self.index.ntotal} vectors, {len(self.metadata)} metadata entries. "
                "Rebuild the FAISS index from stored images/captions before searching or adding."
            )
