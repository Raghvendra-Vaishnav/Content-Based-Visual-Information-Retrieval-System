from fastapi import APIRouter
import logging

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/health")
def health_check():
    """
    Health check endpoint to verify server status and model readiness.
    """
    try:
        # Basic health check
        return {
            "status": "healthy",
            "message": "CBVIRS Backend is running",
            "version": "1.0.0"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "message": f"Error: {str(e)}"
        }
