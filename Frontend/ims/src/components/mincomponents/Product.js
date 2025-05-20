import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log(id);
        // Use the new route that populates project names
        const res = await fetch(
          `http://localhost:3001/api/products/${id}/details`
        );
        if (!res.ok) {
          throw new Error("Product not found");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading product...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold">
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
        {product.ProductName}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold text-gray-800">Price:</span> ₹
            {product.ProductPrice}
          </p>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold text-gray-800">Barcode:</span>{" "}
            {product.ProductBarcode}
          </p>
          <p className="text-gray-600 text-lg mb-2">
            <span className="font-semibold text-gray-800">Dimension:</span>{" "}
            {product.dimension}
          </p>
          <p className="text-lg mb-2">
            <span className="font-semibold">Stock Left:</span>{" "}
            <span
              className={
                product.stockLeft > 0
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {product.stockLeft}
            </span>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Projects</h2>
          {product.projects.length === 0 ? (
            <p className="text-gray-500 italic">No projects assigned</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {product.projects.map(({ project, quantity }) => (
                <li key={project._id}>
                  <span className="font-medium">{project.name}</span>
                  {" — Quantity: "}
                  {quantity}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 bg-teal-700 hover:bg-teal-600 text-white px-6 py-2 rounded-md shadow-md transition"
      >
        ← Back
      </button>
    </div>
  );
};

export default Product;
