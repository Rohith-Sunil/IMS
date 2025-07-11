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
/Invento
  ├── Frontend/ims/           # React frontend
  ├── Backend/                # Express backend
  ├── ml-api/updated/         # FastAPI for semantic search (FAISS)
  ├── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rohith-Sunil/IMS.git
cd IMS
```

### 2. Setup the Backend

```bash
cd Backend
npm install
nodemon index.js
```

### 3. Setup the Frontend

```bash
cd ../Frontend/ims
npm install
npm start
```

### 4. Start the ML API (FAISS)

```bash
cd ../../ml-api/updated
pip install -r requirements.txt  # or install manually
uvicorn faiss_api_new:app --host 127.0.0.1 --port 8009 --reload
```

---

## 🔧 Environment Variables

Create a `.env` file in the `Backend/` folder:

```env
MONGO_URL=mongodb://localhost:27017/ims
PORT=3001
```

---

## 🧩 Future Features

- 🔐 JWT-based authentication and user roles  
- 📊 Dashboard with inventory analytics  
- 📥 CSV import/export for bulk inventory management  
- 🚨 Real-time low-stock notifications  

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and open pull requests. Suggestions and improvements are appreciated.

---

## 📄 License

This project is licensed under the MIT License.
