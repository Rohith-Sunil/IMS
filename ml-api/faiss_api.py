from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv() 
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "test")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "products")





app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],            
    allow_headers=["*"],             
)

from bson import ObjectId

def convert_object_ids(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, list):
        return [convert_object_ids(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: convert_object_ids(v) for k, v in obj.items()}
    return obj



client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]


model = SentenceTransformer("all-MiniLM-L6-v2")

products = list(collection.find({}))
product_texts = []
id_map = []

for product in products:
    #  text = f"{product.get('ProductName', '')}, price {product.get('ProductPrice', '')}, {product.get('dimension', '')}"
    text = f"Product: {product.get('ProductName', '')}, Price: {product.get('ProductPrice', '')}, Barcode: {product.get('ProductBarcode', '')}, Dimension: {product.get('dimension', '')}"

    product_texts.append(text)
    id_map.append(str(product["_id"]))


with open("id_map.pkl", "wb") as f:
    pickle.dump(id_map, f)


vectors = model.encode(product_texts, convert_to_numpy=True)


index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)

@app.post("/search")
async def search(request: Request):
    data = await request.json()
    query = data.get("query", "")
    print("QUERY:", query)

    query_vector = model.encode([query])[0].astype("float32")
    D, I = index.search(np.array([query_vector]), k=5)

    results = []
    for i, d in zip(I[0], D[0]):
        product_id = id_map[i]
        product = collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product["distance"] = float(d)
            product = convert_object_ids(product)  
            results.append(product)
        else:
            print(f"Product with ID {product_id} not found")

    return {"matches": results}

@app.post("/rebuild_index")
async def rebuild_index():
    global index, id_map

    products = list(collection.find({}))
    product_texts = []
    id_map = []

    for product in products:
        # text = f"{product.get('ProductName', '')}, price {product.get('ProductPrice', '')}, {product.get('dimension', '')}, stock {product.get('stockLeft', '')}"
        text = f"Product: {product.get('ProductName', '')}, Price: {product.get('ProductPrice', '')}, Barcode: {product.get('ProductBarcode', '')}, Dimension: {product.get('dimension', '')}"

        product_texts.append(text)
        id_map.append(str(product["_id"]))

    vectors = model.encode(product_texts, convert_to_numpy=True)
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    return {"message": "Index rebuilt", "total": len(products)}

@app.post("/search_all")
async def search_all(request: Request):
    data = await request.json()
    query = data.get("query", "")
    limit = data.get("limit", 20)       # default 20 per page
    offset = data.get("offset", 0)      # default start at 0
    print("QUERY:", query)

    query_vector = model.encode([query])[0].astype("float32")
    k = len(id_map)
    D, I = index.search(np.array([query_vector]), k=k)

    selected_indices = I[0][offset:offset+limit]
    selected_distances = D[0][offset:offset+limit]

    results = []
    for i, d in zip(selected_indices, selected_distances):
        product_id = id_map[i]
        product = collection.find_one({"_id": ObjectId(product_id)})
        if product:
            product["distance"] = float(d)
            product = convert_object_ids(product)
            results.append(product)

    return {"matches": results, "total": k}





# @app.post("/search")
# async def search(request: Request):
#     data = await request.json()
#     query = data.get("query", "")
#     print("QUERY:", query)

#     query_vector = model.encode([query])[0].astype("float32")
#     D, I = index.search(np.array([query_vector]), k=5)

#     print("FAISS INDEXES:", I)
#     print("DISTANCES:", D)

#     results = []
#     for i, d in zip(I[0], D[0]):
#         product_id = id_map[i]
#         # print("LOOKING FOR ID:", product_id)
#         product = collection.find_one({"_id": ObjectId(product_id)})
#         if product:
#             product["_id"] = str(product["_id"])
#             product["distance"] = float(d)
#             results.append(product)
#         else:
#             print(f"Product with ID {product_id} not found")
    
#     return {"matches": results}


    # from fastapi import FastAPI, Request
# from sentence_transformers import SentenceTransformer
# import faiss
# import numpy as np

# app = FastAPI()

# # Load the embedding model
# model = SentenceTransformer("all-MiniLM-L6-v2")

# # Sample product list (replace with MongoDB later)
# product_texts = [
#     "IC 560, price 29, 24x50x10, stock 23",
#     "Voltage Regulator, price 10, 10x10x5, stock 50",
#     "Transistor A1200, price 40, 5x5x5, stock 5"
# ]
# vectors = model.encode(product_texts, convert_to_numpy=True)

# # Build the FAISS index
# index = faiss.IndexFlatL2(vectors.shape[1])
# index.add(vectors)

# @app.post("/search")
# async def search(request: Request):
#     data = await request.json()
#     query = data.get("query", "")
#     query_vector = model.encode([query])[0].astype("float32")
#     D, I = index.search(np.array([query_vector]), k=3)
#     return {
#         "matches": [
#             {"index": int(i), "distance": float(d)}
#             for i, d in zip(I[0], D[0])
#         ]
#     }

