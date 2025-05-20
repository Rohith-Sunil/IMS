const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");
const Product = require("../Models/Product");

// POST /api/projects/insertproject — Insert a new project
router.post("/insertproject", async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Please provide a project name." });
  }

  try {
    const newProject = new Project({
      name,
      description,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Server error while creating project." });
  }
});

// GET /api/projects — Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Server error while fetching projects." });
  }
});

// GET /api/projects/:id — Get a specific project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Server error while fetching the project." });
  }
});

// // GET /api/projects/:id/products
// router.get("/:id/products", async (req, res) => {
//   const projectId = req.params.id;

//   try {
//     const products = await Product.find({ projects: projectId });
//     res.json(products);
//   } catch (err) {
//     console.error("Error fetching products for project:", err);
//     res
//       .status(500)
//       .json({ error: "Failed to fetch products for this project." });
//   }
// });

// GET /api/projects/:id/products
router.get("/:id/products", async (req, res) => {
  const projectId = req.params.id;

  try {
    // Find products where projects array contains an object with project field equal to projectId
    const products = await Product.find({ "projects.project": projectId });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products for project:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch products for this project." });
  }
});

// PUT /api/projects/update/:id
router.put("/update/:id", async (req, res) => {
  const { name, description } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Server error while updating project." });
  }
});

// PUT /api/projects/:projectId/remove-component/:productId
router.put("/:projectId/remove-component/:productId", async (req, res) => {
  const { projectId, productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Filter out the project reference
    product.projects = product.projects.filter(
      (p) => p.project.toString() !== projectId
    );

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error removing component from project:", error);
    res.status(500).json({ error: "Server error while updating product." });
  }
});

module.exports = router;
