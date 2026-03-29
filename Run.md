# How to run Project

## Frontend

```bash
cd frontend
npm run dev
```

## Backend

```bash
cd backend
conda activate intern
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
