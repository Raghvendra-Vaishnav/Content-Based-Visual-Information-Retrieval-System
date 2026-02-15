from pydantic import BaseModel
from typing import List

class UploadResponse(BaseModel):
    caption: str
    embedding_dim: int

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchResult(BaseModel):
    image_path: str
    caption: str
    distance: float

class SearchResponse(BaseModel):
    results: List[SearchResult]
