import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";

export default function InsertProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [dimension, setProductDimension] = useState("");
  const [stockLeft, setProductStockLeft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  // Input handlers
  const setName = (e) => setProductName(e.target.value);
  const setPrice = (e) => setProductPrice(e.target.value);
  const setBarcode = (e) => setProductBarcode(e.target.value.slice(0, 12));
  const setDimension = (e) => setProductDimension(e.target.value);
  const setStockLeftInput = (e) => setProductStockLeft(e.target.value);

  // Fetch product on load
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setProductName(data.ProductName || "");
        setProductPrice(data.ProductPrice || "");
        setProductBarcode(data.ProductBarcode || "");
        setProductDimension(data.dimension || "");
        setProductStockLeft(data.stockLeft || "");
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the product.");
      }
    };
    getProduct();
  }, [id]);

  // Update handler
  const updateProduct = async (e) => {
    e.preventDefault();

    if (
      !productName &&
      !productPrice &&
      !productBarcode &&
      !dimension &&
      !stockLeft
    ) {
      setError("*Please fill in at least one field to update.");
      return;
    }

    setLoading(true);
    setError("");

    const updatedProduct = {};
    if (productName) updatedProduct.ProductName = productName;
    if (productPrice) updatedProduct.ProductPrice = productPrice;
    if (productBarcode) updatedProduct.ProductBarcode = productBarcode;
    if (dimension) updatedProduct.dimension = dimension;
    if (stockLeft) updatedProduct.stockLeft = stockLeft;

    try {
      const response = await fetch(
        `http://localhost:3001/api/products/updateproduct/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        alert("Product updated successfully!");
        navigate("/products");
      } else {
        setError("Update failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">
        Update Product Information
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={setName}
            className="mt-2 w-full p-3 border rounded-md"
            placeholder="Enter Product Name"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={productPrice}
            onChange={setPrice}
            className="mt-2 w-full p-3 border rounded-md"
            placeholder="Enter Product Price"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Barcode
          </label>
          <input
            type="number"
            value={productBarcode}
            onChange={setBarcode}
            className="mt-2 w-full p-3 border rounded-md"
            maxLength={12}
            placeholder="Enter Product Barcode"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Dimension
          </label>
          <input
            type="text"
            value={dimension}
            onChange={setDimension}
            className="mt-2 w-full p-3 border rounded-md"
            placeholder="Enter Product Dimension"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Stock Left
          </label>
          <input
            type="number"
            value={stockLeft}
            onChange={setStockLeftInput}
            className="mt-2 w-full p-3 border rounded-md"
            placeholder="Enter Stock Left"
          />
        </div>

        {error && <div className="text-red-600 mt-4 text-lg">{error}</div>}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <NavLink
          to="/products"
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Cancel
        </NavLink>

        <button
          type="submit"
          onClick={updateProduct}
          className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
