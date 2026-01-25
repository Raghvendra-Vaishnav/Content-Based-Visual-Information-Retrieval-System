from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes_health import router as health_router
from app.api.routes_upload import router as upload_router
from app.api.routes_search import router as search_router
import logging
from app.config import IMAGE_DIR
import uvicorn

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="CBVIRS Backend API",
    description="Content-Based-Visual-Information-Retrieval-System - Context-Aware Search System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for images
app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

# Include routers
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(search_router, prefix="/api", tags=["search"])

@app.get("/")
def root():
    return {"message": "Welcome to CBVIRS Backend API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
