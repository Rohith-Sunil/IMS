const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

// Import project and product routes
const projectRoutes = require("./Routes/projectRoutes");
const productRoutes = require("./Routes/productRoutes");
const searchRoute = require("./Routes/search");
const purchaseRoute = require("./Routes/purchaseRoutes");
const userRoutes = require("./Routes/userRoutes");

connectToMongo(); // Connect to MongoDB

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes setup
app.use("/api/projects", projectRoutes); // Project routes
app.use("/api/products", productRoutes); // Product routes
app.use("/api/search", searchRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/user", userRoutes); // User routes

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
