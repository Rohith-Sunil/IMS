import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { IoCaretBackOutline } from "react-icons/io5";

export default function InsertProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState();
  const [productBarcode, setProductBarcode] = useState();
  const [dimension, setDimension] = useState("");
  const [stockLeft, setStockLeft] = useState("");
  const [stockRequired, setStockRequired] = useState("");
  const [projectId, setProjectId] = useState();
  const [projects, setProjects] = useState([]);
  const [productid, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [productUpdate, setProductUpdate] = useState(false);
  const [currentProjectIds, setCurrentProjectIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const passedProjectId = location.state?.projectId;

  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        if (passedProjectId) setProjectId(passedProjectId);
      })
      .catch((err) => console.error("Failed to fetch projects", err));
  }, [passedProjectId]);

  const setBarcode = (e) => {
    const value = e.target.value.slice(0, 12);
    setProductBarcode(value);
  };

  const fetchRecommendations = async (name) => {
    if (!name) return setRecommendations([]);

    try {
      const res = await axios.post("http://localhost:8009/search", {
        query: name,
      });
      if (res.data?.matches) setRecommendations(res.data.matches);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setRecommendations([]);
    }
  };

  const handleProductNameChange = (e) => {
    const name = e.target.value;
    setProductName(name);
    fetchRecommendations(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setRecommendations([]);
    }
  };

  const handleRecommendationSelect = (product) => {
    setProductName(product.ProductName);
    setProductPrice(product.ProductPrice);
    setProductBarcode(product.ProductBarcode);
    setDimension(product.dimension || "");
    setStockLeft(product.stockLeft || 0);
    setProductUpdate(true);
    setProductId(product._id);
    setRecommendations([]);
    setCurrentProjectIds(product.projects);
  };

  const handleStockRequiredChange = (e) => {
    const value = e.target.value;
    setStockRequired(value);
    if (Number(value) > Number(stockLeft) && value !== "") {
      setError("Not enough stock available.");
    } else {
      setError("");
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productBarcode || !stockLeft) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:3001/api/products/insertproduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ProductName: productName,
            ProductPrice: Number(productPrice),
            ProductBarcode: Number(productBarcode),
            dimension,
            stockLeft: Number(stockLeft),
            projects: projectId
              ? [{ project: projectId, quantity: Number(stockLeft) }]
              : [],
          }),
        }
      );

      if (res.status === 201) {
        alert("Product inserted successfully!");
        setProductName("");
        setProductPrice("");
        setProductBarcode("");
        setDimension("");
        setStockRequired("");
        setStockLeft("");
        setProjectId("");
        navigate("/products");
        await axios.post("http://127.0.0.1:8000/rebuild_index");
      } else if (res.status === 422) {
        alert("Product is already added with that barcode.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    let finalStockRequired = Number(stockRequired);
    const updatedStockLeft = stockLeft - Number(stockRequired);

    // if (updatedStockLeft < 0) {
    //   setError("Not enough stock.");
    //   return;
    // }

    if (updatedStockLeft < 0) {
      setError("Not enough stock.");
      finalStockRequired = stockLeft;
      setStockLeft(0);

      // Log the purchase request
      try {
        await fetch("http://localhost:3001/api/purchase/log-purchase-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: productid,
            productName: productName || "Unknown Product",
            //projectId: projectId,
            shortage: Math.abs(updatedStockLeft), // positive shortage value
          }),
        });

        console.log("Purchase request logged.");
      } catch (err) {
        console.error("Failed to log purchase request:", err);
      }
    }

    if (
      !productName &&
      !productPrice &&
      !productBarcode &&
      !dimension &&
      !updatedStockLeft
    ) {
      setError("*Please fill in at least one field to update.");
      return;
    }

    console.log("After:" + stockRequired);

    if (!Number(stockRequired) && !projectId) {
      setError("*Stock quantity must be a positive number.");
      return;
    }

    setLoading(true);
    setError("");

    const updatedProduct = {};
    if (productName) updatedProduct.ProductName = productName;
    if (productPrice) updatedProduct.ProductPrice = productPrice;
    if (productBarcode) updatedProduct.ProductBarcode = productBarcode;
    if (dimension) updatedProduct.dimension = dimension;
    if (updatedStockLeft !== undefined) {
      if (updatedStockLeft >= 0) updatedProduct.stockLeft = updatedStockLeft;
      else updatedProduct.stockLeft = 0;
    }

    updatedProduct.projects = [...(currentProjectIds.projects || [])];

    const projectIndex = updatedProduct.projects.findIndex(
      (p) => p.project.toString() === projectId
    );

    if (projectIndex !== -1) {
      updatedProduct.projects[projectIndex].quantity =
        Number(updatedProduct.projects[projectIndex].quantity || 0) +
        Number(finalStockRequired);
    } else {
      updatedProduct.projects.push({
        project: projectId,
        quantity: Number(finalStockRequired),
      });
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/products/updateproduct/${productid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.status === 200) {
        await axios.post("http://127.0.0.1:8000/rebuild_index");
        alert("Data Updated");
        navigate("/products");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 max-w-3xl mx-auto ">
      <div className="mb-2 flex flex-row -ml-8">
        {/* <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-black-600 font-semibold"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button> */}
        <IoCaretBackOutline
          onClick={() => navigate(-1)}
          className="w-8 h-8 mt-1 text-gray-800 cursor-pointer hover:text-teal-600"
        />
        <h1 className="text-3xl font-bold mb-6">Enter Component Information</h1>{" "}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          onChange={handleProductNameChange}
          value={productName}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          placeholder="Enter Product Name"
          required
        />
        {passedProjectId && productName && recommendations.length > 0 && (
          // <div className="border mt-2 rounded shadow max-h-48 overflow-y-auto bg-white z-10">
          //   {recommendations.map((product) => (
          //     <button
          //       key={product._id}
          //       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          //       type="button"
          //       onClick={() => handleRecommendationSelect(product)}
          //     >
          //       {product.ProductName}
          //     </button>
          //   ))}
          // </div>
          <div className="border mt-2 rounded shadow max-h-48 overflow-y-auto bg-white z-10">
            {recommendations.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleRecommendationSelect(product)}
                className="w-full px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
              >
                <span className="font-medium truncate max-w-[50%]">
                  {product.ProductName}
                </span>
                <div className="flex space-x-4 min-w-[220px] justify-end text-sm text-gray-600">
                  <span className="whitespace-nowrap">
                    Barcode: {product.ProductBarcode}
                  </span>
                  <span className="whitespace-nowrap">
                    Dimension: {product.dimension}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          onChange={(e) => setProductPrice(e.target.value)}
          value={productPrice}
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          placeholder="Enter Product Price"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Barcode</label>
        <input
          type="number"
          onChange={setBarcode}
          value={productBarcode}
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          placeholder="Enter Product Barcode"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Dimension</label>
        <input
          type="text"
          onChange={(e) => setDimension(e.target.value)}
          value={dimension}
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          placeholder="e.g. 10x20x5 cm"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Quantity</label>
        <input
          type="number"
          onChange={
            productUpdate
              ? handleStockRequiredChange
              : (e) => setStockLeft(e.target.value)
          }
          value={productUpdate ? stockRequired : stockLeft}
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          placeholder="Enter stock quantity"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-1">Project Name</label>
        <select
          className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
          onChange={(e) => setProjectId(e.target.value)}
          value={projectId}
          disabled={!!passedProjectId}
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* {projectId && (
        <div className="mb-6">
          <label className="block font-semibold mb-1">Quantity</label>
          <select
            className="w-full border border-gray-300 rounded px-4 py-2 text-lg"
            onChange={(e) => setProjectId(e.target.value)}
            value={projectId}
            disabled={!!passedProjectId}
          ></select>
        </div>
      )} */}

      <div className="flex justify-center mb-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={productUpdate ? updateProduct : addProduct}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>

      {error && <div className="text-red-600 text-center">{error}</div>}
    </div>
  );
}
