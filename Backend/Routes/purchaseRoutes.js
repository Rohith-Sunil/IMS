// routes/purchaseRequests.js
const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const PurchaseRequest = require("../models/Purchase");

router.post("/log-purchase-request", async (req, res) => {
  try {
    const { productId, productName, shortage } = req.body;

    // Check if there's already a request for the same product and project
    const existingRequest = await PurchaseRequest.findOne({
      productId,
    });

    if (existingRequest) {
      // Update the existing shortage value
      existingRequest.shortage += shortage;
      await existingRequest.save();
      return res.status(200).json({ message: "Purchase request updated." });
    }

    // Create a new purchase request
    const newRequest = new PurchaseRequest({
      productId,
      productName,
      shortage,
    });

    await newRequest.save();
    res.status(200).json({ message: "Purchase request logged." });
  } catch (err) {
    console.error("Failed to log purchase request:", err);
    res.status(500).json({ error: "Failed to log request." });
  }
});

// GET /api/purchase/requests - Get all purchase requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await PurchaseRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching purchase requests:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching purchase requests." });
  }
});

router.get("/export-purchase-requests", async (req, res) => {
  try {
    const requests = await PurchaseRequest.find(); // No need to populate

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchase Requests");

    // Define headers
    worksheet.columns = [
      {
        header: "Product Name",
        key: "productName",
        width: 25,
        style: { alignment: { horizontal: "center" } },
      },
      {
        header: "Product ID",
        key: "productId",
        width: 30,
        style: { alignment: { horizontal: "center" } },
      },
      {
        header: "Shortage",
        key: "shortage",
        width: 10,
        style: { alignment: { horizontal: "center" } },
      },
      {
        header: "Date",
        key: "date",
        width: 20,
        style: { alignment: { horizontal: "center" } },
      },
    ];

    // Add rows
    requests.forEach((req) => {
      worksheet.addRow({
        productName: req.productName || "N/A",
        productId: req.productId?.toString() || "N/A",
        shortage: req.shortage,
        date: new Date(req.date).toLocaleString(),
      });
    });

    // Set headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="purchase_requests.xlsx"'
    );

    // Stream Excel to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Failed to export Excel:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to export Excel." });
    }
  }
});

// PUT /api/purchase/requests/:id - Update a specific purchase request
router.put("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const { productName, shortage } = req.body;

  try {
    const request = await PurchaseRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Purchase request not found." });
    }

    if (productName !== undefined) request.productName = productName;
    if (shortage !== undefined) request.shortage = shortage;

    await request.save();
    res.status(200).json({ message: "Purchase request updated.", request });
  } catch (err) {
    console.error("Error updating purchase request:", err);
    res.status(500).json({ error: "Server error while updating request." });
  }
});
// DELETE /api/purchase/requests/:id - Delete a specific purchase request
router.delete("/requests/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await PurchaseRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Purchase request not found." });
    }
    res.status(200).json({ message: "Purchase request deleted." });
  } catch (err) {
    console.error("Error deleting purchase request:", err);
    res.status(500).json({ error: "Server error while deleting request." });
  }
});

module.exports = router;
