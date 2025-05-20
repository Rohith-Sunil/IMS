from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from bson import ObjectId
import faiss
import numpy as np
import pickle
import os
from dotenv import load_dotenv
from pathlib import Path

# Path to the .env file in the root directory
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# CORS settings
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "test")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "products")

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]


# Sentence Transformer
model = SentenceTransformer("all-MiniLM-L6-v2")

# Global FAISS variables
index = None
id_map = []
dimension = 384  # MiniLM-L6-v2 output size
nlist = 100      # number of clusters

# Convert ObjectId recursively
def convert_object_ids(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [convert_object_ids(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: convert_object_ids(v) for k, v in obj.items()}
    return obj

# Build IVF FAISS index
def build_ivf_index():
    global index, id_map

    products = list(collection.find({}))
    product_texts = []
    id_map = []

    for product in products:
        text = f"Product: {product.get('ProductName', '')}, Price: {product.get('ProductPrice', '')}, Barcode: {product.get('ProductBarcode', '')}, Dimension: {product.get('dimension', '')}"
        product_texts.append(text)
        id_map.append(str(product["_id"]))

    vectors = model.encode(product_texts, convert_to_numpy=True).astype("float32")
    nlist = min(10, len(vectors))

    # Save mapping for later
    with open("id_map.pkl", "wb") as f:
        pickle.dump(id_map, f)

    quantizer = faiss.IndexFlatL2(dimension)
    index = faiss.IndexIVFFlat(quantizer, dimension, nlist, faiss.METRIC_L2)
    index.train(vectors)
    index.add(vectors)
    index.nprobe = 10  # control search accuracy vs speed

# Initialize at startup
build_ivf_index()

@app.post("/search")
async def search(request: Request):
    data = await request.json()
    query = data.get("query", "")
    query_vector = model.encode([query])[0].astype("float32")
    D, I = index.search(np.array([query_vector]), k=5)
    print("QUERY:", query)

    results = []
    for i, d in zip(I[0], D[0]):
        if i < 0:
            continue  # skip invalid matches
        product_id = id_map[i]
        product = collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product["distance"] = float(d)
            product = convert_object_ids(product)
            results.append(product)

    return {"matches": results}

@app.post("/search_all")
async def search_all(request: Request):
    data = await request.json()
    query = data.get("query", "")
    limit = data.get("limit", 20)
    offset = data.get("offset", 0)

    query_vector = model.encode([query])[0].astype("float32")
    k = len(id_map)
    D, I = index.search(np.array([query_vector]), k=k)

    selected_indices = I[0][offset:offset+limit]
    selected_distances = D[0][offset:offset+limit]

    results = []
    for i, d in zip(selected_indices, selected_distances):
        if i < 0:
            continue
        product_id = id_map[i]
        product = collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product["distance"] = float(d)
            product = convert_object_ids(product)
            results.append(product)

    return {"matches": results, "total": k}

@app.post("/rebuild_index")
async def rebuild_index():
    build_ivf_index()
    return {"message": "IVF Index rebuilt", "total": len(id_map)}
