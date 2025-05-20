const mongoose = require("mongoose");

const PurchaseRequestSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: String,
  // projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  shortage: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PurchaseRequest", PurchaseRequestSchema);
