# Content-Based-Visual-Information-Retrieval-System (CBVIRS): A Context-Aware Search System using Scene Graph

Content-Based-Visual-Information-Retrieval-System (CBVIRS): A Context-Aware Search System using Scene Graph Generation and Graph Neural Networks.

## Project Features / Modules

1. Scene Graph Generation Engine: Analyzes images to identify objects, attributes, and semantic relationships (e.g., [boy]—next to—[car]), generating a structured scene graph that represents the image's content.
2. Graph Embedding and Indexing: Uses a Graph Neural Network (GNN) to convert each scene graph into a contextual vector embedding. These embeddings are indexed in a high-speed vector database for rapid retrieval.
3. Natural Language Query Engine: Processes natural language queries using a Transformer model, converting them into vectors that are mathematically aligned with the image embeddings for accurate matching.
4. User Dashboard: A React-based web application provides a dynamic user interface for real-time query input and visualization of retrieved image results.

## Background Survey

While platforms like Google Photos handle object search, they lack precision in relational queries. Our work builds on research in Scene Graph Generation and Vision-Language Models, leveraging open-source datasets like Visual Genome. The project's novelty is the creation of a practical, end-to-end system using explicit graph structures for precise, explainable image retrieval, bridging the gap between academic research and real-world application.

## Proposed Technology Stack

- Backend: Python, Flask / FastAPI
- Frontend: React.js
- Deep Learning: TensorFlow, Keras, Hugging Face Transformers
- Computer Vision: TensorFlow Object Detection, Video Analysis , OpenCV
- Vector Database: Faiss (Meta)
- Datasets: Visual Genome, COCO / Flickr30k

## Highlight of the Project

1. Beyond Keywords to Context: Enables searching based on relationships, actions, and
   interactions, allowing for truly semantic, human-like queries that go beyond simple object
   tagging.
2. Explainable AI (XAI): The graph-based approach offers high interpretability by showing
   the specific relationships that matched a query, building trust and transparency over
   "black-box" models.
3. Scalable & Industry-Relevant Architecture: A decoupled frontend (React) and
   backend (Python) with a vector database ensures scalability and mirrors modern
   production systems relevant to AI and Full-Stack careers.
4. Interdisciplinary Learning: Integrates Computer Vision, NLP, and Graph Machine
   Learning, providing hands-on experience in building complex AI pipelines, from model
   development to API and UI creation.

## Guided By

**_Dr. Sharvan Ram_** **(Head of the CSE Department)**
