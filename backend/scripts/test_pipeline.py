#!/usr/bin/env python3
"""
Comprehensive Pipeline Testing Script

Tests the complete upload → caption → embedding → search cycle.
Run this to validate the entire CBVIRS pipeline functionality.
"""

import os
import sys
import json
import logging
import requests
import time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent.parent / "app"))

from app.config import IMAGE_DIR, FAISS_DIR
from app.core.vector_store import FaissIndex

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class PipelineTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_image_path = None

    def create_test_image(self):
        """Create a simple test image for testing."""
        # Create a simple test image
        img = Image.new('RGB', (224, 224), color='blue')
        draw = ImageDraw.Draw(img)

        # Try to use a default font, fallback to basic if not available
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()

        # Add some text
        draw.text((50, 100), "TEST IMAGE", fill='white', font=font)

        # Save the test image
        self.test_image_path = os.path.join(IMAGE_DIR, "pipeline_test.jpg")
        img.save(self.test_image_path)
        logger.info(f"Created test image: {self.test_image_path}")
        return self.test_image_path

    def test_health_endpoint(self):
        """Test the health endpoint."""
        logger.info("Testing health endpoint...")
        try:
            response = requests.get(f"{self.base_url}/api/health")
            if response.status_code == 200:
                logger.info("✅ Health endpoint working")
                return True
            else:
                logger.error(f"❌ Health endpoint failed: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"❌ Health endpoint error: {str(e)}")
            return False

    def test_upload_pipeline(self):
        """Test the upload with caption endpoint."""
        logger.info("Testing upload pipeline...")
        try:
            with open(self.test_image_path, 'rb') as f:
                files = {'file': ('pipeline_test.jpg', f, 'image/jpeg')}
                response = requests.post(f"{self.base_url}/api/upload_with_caption", files=files)

            if response.status_code == 200:
                data = response.json()
                logger.info("✅ Upload successful")
                logger.info(f"   Generated {len(data.get('captions', []))} captions")
                logger.info(f"   Image saved to: {data.get('image_path', 'N/A')}")
                return True, data
            else:
                logger.error(f"❌ Upload failed: {response.status_code} - {response.text}")
                return False, None
        except Exception as e:
            logger.error(f"❌ Upload error: {str(e)}")
            return False, None

    def test_text_search(self):
        """Test text-based search."""
        logger.info("Testing text search...")
        try:
            payload = {"query": "blue test image", "top_k": 3}
            response = requests.post(f"{self.base_url}/api/search_text",
                                   json=payload,
                                   headers={'Content-Type': 'application/json'})

            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                logger.info(f"✅ Text search successful - found {len(results)} results")
                if results:
                    logger.info(f"   Top result distance: {results[0].get('distance', 'N/A')}")
                return True
            else:
                logger.error(f"❌ Text search failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"❌ Text search error: {str(e)}")
            return False

    def test_image_search(self):
        """Test image-based search."""
        logger.info("Testing image search...")
        try:
            with open(self.test_image_path, 'rb') as f:
                files = {'file': ('pipeline_test.jpg', f, 'image/jpeg')}
                response = requests.post(f"{self.base_url}/api/search_image", files=files)

            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                logger.info(f"✅ Image search successful - found {len(results)} results")
                if results:
                    logger.info(f"   Top result distance: {results[0].get('distance', 'N/A')}")
                return True
            else:
                logger.error(f"❌ Image search failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"❌ Image search error: {str(e)}")
            return False

    def test_index_consistency(self):
        """Test FAISS index and metadata consistency."""
        logger.info("Testing index consistency...")
        try:
            faiss_index = FaissIndex(dim=512)
            faiss_index.load()

            index_size = faiss_index.index.ntotal
            metadata_size = len(faiss_index.metadata)

            logger.info(f"   FAISS index size: {index_size}")
            logger.info(f"   Metadata size: {metadata_size}")

            if index_size == metadata_size:
                logger.info("✅ Index and metadata are consistent")
                return True
            else:
                logger.error(f"❌ Index inconsistency: {index_size} vs {metadata_size}")
                return False
        except Exception as e:
            logger.error(f"❌ Index consistency check error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run the complete test suite."""
        logger.info("🚀 Starting CBVIRS Pipeline Tests")
        logger.info("=" * 50)

        # Wait for server to be ready
        logger.info("Waiting for server to be ready...")
        time.sleep(2)

        tests = [
            ("Health Endpoint", self.test_health_endpoint),
            ("Index Consistency", self.test_index_consistency),
            ("Upload Pipeline", lambda: self.test_upload_pipeline()[0]),
            ("Text Search", self.test_text_search),
            ("Image Search", self.test_image_search),
        ]

        passed = 0
        total = len(tests)

        for test_name, test_func in tests:
            logger.info(f"\n📋 Running: {test_name}")
            try:
                if test_func():
                    passed += 1
                    logger.info(f"✅ {test_name}: PASSED")
                else:
                    logger.error(f"❌ {test_name}: FAILED")
            except Exception as e:
                logger.error(f"❌ {test_name}: ERROR - {str(e)}")

        logger.info("\n" + "=" * 50)
        logger.info(f"📊 Test Results: {passed}/{total} tests passed")

        if passed == total:
            logger.info("🎉 All tests passed! Pipeline is working correctly.")
            return True
        else:
            logger.warning(f"⚠️  {total - passed} test(s) failed. Check logs above.")
            return False

def main():
    tester = PipelineTester()

    # Create test image
    tester.create_test_image()

    # Run tests
    success = tester.run_all_tests()

    # Cleanup
    if tester.test_image_path and os.path.exists(tester.test_image_path):
        os.remove(tester.test_image_path)
        logger.info("Cleaned up test image")

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
