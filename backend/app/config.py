import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_DIR = os.path.join(BASE_DIR, "storage/images")
FAISS_DIR = os.path.join(BASE_DIR, "storage/faiss_index")
LOG_DIR = os.path.join(BASE_DIR, "logs")

CLIP_MODEL = "ViT-B/32"
YOLO_MODEL_PATH = "yolov8n.pt"  # small model, downloads automatically if missing

# Ensure directories exist
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(FAISS_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
