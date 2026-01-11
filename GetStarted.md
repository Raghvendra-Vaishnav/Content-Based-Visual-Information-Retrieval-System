# GetStarted

**Project Name:**
**Content-Based-Visual-Information-Retrieval-System (CBVIRS):** A context-aware search system using _Scene Graph Generation_ and _Graph Neural Networks (GNNs)_.

**Goal:**
To allow users to search for images **based on relationships and context**, not just object names — e.g., “boy standing next to car” instead of only “boy” or “car.”

---

## Main Components (from your files)

1. **Scene Graph Generation Engine**

   - Input: image
   - Output: structured graph showing objects, attributes, and relationships.
   - Tools: TensorFlow, OpenCV, pre-trained object detection + Visual Genome dataset.

2. **Graph Embedding and Indexing**

   - Converts the scene graph into vector embeddings using a GNN.
   - Indexes vectors in a **Faiss (Meta)** vector database for fast similarity search.

3. **Natural Language Query Engine**

   - Uses a **Transformer model (e.g., BERT or CLIP)** to convert a text query into an embedding.
   - Matches this query vector to image embeddings in the vector DB.

4. **User Dashboard**

   - Frontend built in **React.js**
   - Communicates with the backend via REST API (Flask/FastAPI)
   - Displays retrieved images and their scene graphs.

---

## Recommended Project Folder Structure

```bash
CBVIRS/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI/Flask app entry
│   │   ├── routes/               # API endpoints
│   │   ├── models/               # GNN and transformer models
│   │   ├── utils/                # helper scripts (graph building, preprocessing)
│   │   ├── db/                   # Faiss vector index
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/             # API calls to backend
│   └── package.json
│
├── datasets/
│   ├── visual_genome/
│   ├── coco/
│
├── notebooks/
│   ├── scene_graph_generation.ipynb
│   ├── gnn_training.ipynb
│
├── README.md
└── .gitignore
```

---

## Step-by-Step Path to Start

### **Phase 1: Setup & Research**

- Install Python (≥3.9), Node.js, and Git.
- Create virtual environments for backend and frontend.
- Study **Scene Graph Generation** (e.g., using Visual Genome dataset).
- Explore pretrained models like:

  - `Neural-Motif`, `Graph-RCNN`, or `RelTR` for scene graph generation.
  - `DGL` or `PyTorch Geometric` for GNN embeddings.
  - `Sentence-BERT` or `CLIP` for text embeddings.

---

### **Phase 2: Backend Development**

1. **Start FastAPI or Flask server**

   - Create endpoints like:

     - `/upload_image` → generates and stores embeddings.
     - `/search` → takes a query and returns top matching images.

2. **Integrate FAISS**

   - Store graph embeddings in Faiss for fast similarity retrieval.

3. **Build model modules**

   - Load scene graph generator, GNN, and Transformer models.

---

### **Phase 3: Frontend (React.js)**

1. Build a dashboard with:

   - Image upload option.
   - Search input (natural language).
   - Grid display of matched images with relationship explanations.

2. Use `Axios` or `Fetch` to connect to backend APIs.

---

### **Phase 4: Integration & Testing**

- Test query–image alignment.
- Measure retrieval accuracy.
- Visualize scene graphs for interpretability (Explainable AI).

---

### **Phase 5: Documentation & Deployment**

- Document API routes, dataset preprocessing, and model architecture.
- Deploy backend using **Render / HuggingFace Spaces / AWS EC2**.
- Deploy frontend on **Vercel or Netlify**.

---

## Tech Stack Summary

| Component             | Tools / Frameworks                           |
| --------------------- | -------------------------------------------- |
| Backend               | Python, FastAPI/Flask                        |
| Frontend              | React.js                                     |
| Deep Learning         | TensorFlow, Keras, Hugging Face Transformers |
| Computer Vision       | TensorFlow Object Detection, OpenCV          |
| Graph Neural Networks | DGL or PyTorch Geometric                     |
| Database              | FAISS (Meta)                                 |
| Dataset               | Visual Genome, COCO, Flickr30k               |

---
