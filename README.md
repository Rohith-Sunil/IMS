# 🗂️ Inventory Management System (IMS)

A modern Inventory Management System (IMS) to help teams manage and track product inventory across multiple projects. Built with the MERN stack and styled using Tailwind CSS for a clean, responsive user interface.

---

## 🚀 Features

- 📦 **Product Management** — Add, edit, and delete inventory items  
- 📁 **Project Association** — Assign products to multiple projects with specific quantities  
- 🔍 **Semantic Search** — Fast and intelligent product search with FAISS + FastAPI  
- 🖼️ **Modern UI** — Tailwind CSS design with responsive layout and landing page  
- ⚙️ **Modular Architecture** — Clean separation between frontend, backend, and ML components  

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Router  
- **Backend:** Node.js, Express  
- **Database:** MongoDB with Mongoose  
- **Search Engine:** FAISS (Python + FastAPI)  

---

## 📁 Project Structure

```bash
/ims
  ├── client/             # React frontend
  ├── server/             # Express backend
  ├── ml-api/             # Python FastAPI for semantic search
  ├── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ims.git
cd ims
```

### 2. Setup the Backend

```bash
cd server
npm install
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm start
```

### 4. Start the ML API (FAISS)

```bash
cd ../ml-api
pip install -r requirements.txt
uvicorn faiss_api_new:app --host 127.0.0.1 --port portNumber --reload
```

---

## 🔧 Environment Variables

Example for backend `.env`:

```env
MONGO_URI=mongodb://localhost:27017/ims
PORT=5000
```

---

## 🧩 Future Features

- 🔐 Add user authentication (e.g., JWT-based login/signup)  
- 📊 Inventory analytics and dashboards  
- 📥 CSV import/export for bulk operations  
- 🚨 Low-stock notifications  

---

## 🤝 Contributing

Feel free to fork the repo and submit pull requests. Ideas and suggestions are always welcome!

---

## 📄 License

MIT
