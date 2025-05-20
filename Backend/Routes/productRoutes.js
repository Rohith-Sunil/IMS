const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");
const Project = require("../Models/Project");

// POST /api/products/insertproduct — Insert a new product
router.post("/insertproduct", async (req, res) => {
  const {
    ProductName,
    ProductPrice,
    ProductBarcode,
    dimension,
    stockLeft,
    projects,
  } = req.body;

  try {
    const pre = await Product.findOne({ ProductBarcode: ProductBarcode });

    if (pre) {
      return res.status(422).json("Product is already added.");
    }

    const newProduct = new Product({
      ProductName,
      ProductPrice,
      ProductBarcode,
      dimension,
      stockLeft,
      projects: Array.isArray(projects)
        ? projects.map((p) => ({
            project: p.project,
            quantity: p.quantity,
          }))
        : [],
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error inserting product:", err);
    res.status(500).json({ error: "Server error while inserting product." });
  }
});

// GET /api/products — Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("projects");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error while fetching products." });
  }
});

// GET /api/products/:id — Get a specific product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("projects");
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Server error while fetching product." });
  }
});

// router.put("/updateproduct/:id", async (req, res) => {
//   const {
//     ProductName,
//     ProductPrice,
//     ProductBarcode,
//     Dimension,
//     stockLeft,
//     projects,
//   } = req.body;

//   // Prepare an object with the fields that need to be updated (if they are provided)
//   const updateFields = {};

//   if (ProductName) updateFields.ProductName = ProductName;
//   if (ProductPrice) updateFields.ProductPrice = ProductPrice;
//   if (ProductBarcode) updateFields.ProductBarcode = ProductBarcode;
//   if (Dimension) updateFields.Dimension = Dimension;
//   if (stockLeft) updateFields.stockLeft = stockLeft;
//   if (projects) {
//     if (Array.isArray(projects)) {
//       updateFields.projects = projects;
//     } else {
//       return res.status(400).json({ error: "Projects should be an array." });
//     }
//   }

//   try {
//     // Update the product using findByIdAndUpdate
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateFields,
//       { new: true }
//     );

//     // If the product isn't found
//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found." });
//     }

//     // Send the updated product data back to the client
//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     console.error("Error updating product:", err);
//     res.status(500).json({ error: "Server error while updating product." });
//   }
// });

router.put("/updateproduct/:id", async (req, res) => {
  const {
    ProductName,
    ProductPrice,
    ProductBarcode,
    dimension,
    stockLeft,
    projects,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Update basic fields
    if (ProductName) product.ProductName = ProductName;
    if (ProductPrice) product.ProductPrice = ProductPrice;
    if (ProductBarcode) product.ProductBarcode = ProductBarcode;
    if (dimension) product.dimension = dimension;
    if (stockLeft !== undefined) product.stockLeft = stockLeft;

    // Handle project quantity updates
    if (Array.isArray(projects)) {
      projects.forEach((incomingProject) => {
        const existingProjectIndex = product.projects.findIndex(
          (p) => p.project.toString() === incomingProject.project
        );

        if (existingProjectIndex !== -1) {
          // Increase the quantity
          product.projects[existingProjectIndex].quantity +=
            incomingProject.quantity;
        } else {
          // Add new project entry
          product.projects.push(incomingProject);
        }
      });
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error while updating product." });
  }
});

// DELETE /api/products/deleteproduct/:id — Delete a product by ID
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Server error while deleting product." });
  }
});
router.get("/:id/details", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("projects.project", "name") // populate only the project name
      .exec();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
