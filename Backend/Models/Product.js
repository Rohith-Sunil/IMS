const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: Number,
    required: true,
  },
  ProductBarcode: {
    type: Number,
    required: true,
  },
  dimension: {
    type: String, // or change to object if needed
  },
  stockLeft: {
    type: Number,
    required: true,
    default: 0,
  },
  // projects: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Project",
  //   },
  // ],
  projects: [
    {
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        // required: true,
      },
      quantity: {
        type: Number,
        // required: true,
        default: 0,
      },
    },
  ],
});

const Products = mongoose.model("Products", ProductSchema);
module.exports = Products;
