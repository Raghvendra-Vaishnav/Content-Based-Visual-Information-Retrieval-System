import sys
sys.path.insert(0, '.')

from app.core.vector_store import FaissIndex
from app.core.embedder import CLIPEmbedder

embedder = CLIPEmbedder()
vs = FaissIndex(dim=512)
vs.load()

query_emb = embedder.embed_text('this is an image of a man getting his hair cut at a barber shop')
results = vs.search(query_emb, k=5)

print('Search results:')
for r in results:
    print(f'  Distance: {r["distance"]}, Caption: {r["metadata"]["caption"]}')
