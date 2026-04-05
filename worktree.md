```root
backend/
GetStarted.md
notebooks/
ROADMAP.md
TODO.md
frontend/
LICENSE
README.md
Run.md
worktree.md
```

```frontend
frontend
├── public
│   ├── placeholder-image.png
│   └── vite.svg
├── src
│   ├── components
│   │   ├── common
│   │   │   ├── ActionButtons.jsx
│   │   │   ├── FileUploadArea.jsx
│   │   │   ├── ImagePreviewCard.jsx
│   │   │   ├── ProgressIndicator.jsx
│   │   │   ├── SearchControls.jsx
│   │   │   └── SnakeGame.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HomePage.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── ImageResultCard.jsx
│   │   ├── ResultsGrid.jsx
│   │   ├── SearchSection.jsx
│   │   └── UploadSection.jsx
│   ├── App.jsx
│   └── main.jsx
├── documentation.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

```backend
backend
├── app
│   ├── __pycache__
│   ├── api
│   │   ├── __pycache__
│   │   ├── __init__.py
│   │   ├── routes_health.py
│   │   ├── routes_search.py
│   │   └── routes_upload.py
│   ├── core
│   │   ├── __pycache__
│   │   ├── __init__.py
│   │   ├── captioner.py
│   │   ├── detector.py
│   │   ├── embedder.py
│   │   ├── scene_graph.py
│   │   ├── utils.py
│   │   └── vector_store.py
│   ├── logs
│   ├── models
│   │   ├── __pycache__
│   │   ├── __init__.py
│   │   ├── data_models.py
│   │   └── db_models.py
│   ├── storage
│   ├── config.py
│   └── main.py
├── scripts
│   ├── benchmark_models.py
│   ├── init_faiss_index.py
│   └── test_pipeline.py
├── documentation.md
├── README.md
├── requirements.txt
├── test_image.jpg
├── test_search.py
├── worktree.py
└── yolov8n.pt
```
