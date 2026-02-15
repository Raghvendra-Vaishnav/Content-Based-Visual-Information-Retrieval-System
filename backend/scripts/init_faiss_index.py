#!/usr/bin/env python3
"""
FAISS Index Initialization Script

This script initializes or validates the FAISS index and metadata consistency.
Run this before starting the application to ensure proper setup.
"""

import os
import sys
import json
import logging
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent.parent / "app"))

from app.config import FAISS_DIR
from app.core.vector_store import FaissIndex

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def initialize_faiss_index():
    """Initialize FAISS index and ensure metadata consistency."""
    try:
        logger.info("Initializing FAISS index...")

        # Create FAISS directory if it doesn't exist
        os.makedirs(FAISS_DIR, exist_ok=True)

        # Initialize FAISS index
        faiss_index = FaissIndex(dim=512)

        # Check if index file exists
        index_path = os.path.join(FAISS_DIR, "index.faiss")
        if os.path.exists(index_path):
            logger.info("Loading existing FAISS index...")
            faiss_index.load()
            logger.info(f"Loaded index with {faiss_index.index.ntotal} vectors")
        else:
            logger.info("Creating new FAISS index...")
            faiss_index.save()
            logger.info("New FAISS index created and saved")

        # Validate metadata consistency
        metadata_path = faiss_index.metadata_path
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)

            logger.info(f"Metadata contains {len(metadata)} entries")

            # Check consistency between FAISS index size and metadata
            if faiss_index.index.ntotal != len(metadata):
                logger.warning(f"Mismatch: FAISS has {faiss_index.index.ntotal} vectors, metadata has {len(metadata)} entries")
                logger.warning("Consider rebuilding the index if this persists")
            else:
                logger.info("FAISS index and metadata are consistent")

        logger.info("FAISS index initialization completed successfully")

    except Exception as e:
        logger.error(f"Error initializing FAISS index: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    initialize_faiss_index()
