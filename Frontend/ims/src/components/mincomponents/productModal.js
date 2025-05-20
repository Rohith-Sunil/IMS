import React, { useEffect, useState } from "react";
import mcu from "../../assets/mcu.png";

const ProductModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/products/${productId}/details`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      setLoading(true);
      fetchProduct();
    }
  }, [productId]);

  if (!productId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>

        {/* Loading or Error */}
        {loading ? (
          <p className="text-center text-gray-500">Loading product...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-3xl font-bold mb-6">{product.ProductName}</h2>

            {/* Product Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p>
                  <strong>Price:</strong> ₹{product.ProductPrice}
                </p>
                <p>
                  <strong>Barcode:</strong> {product.ProductBarcode}
                </p>
                <p>
                  <strong>Dimension:</strong> {product.dimension}
                </p>
                <p>
                  <strong>Stock Left:</strong>{" "}
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

              {/* Image */}
              <div className="w-full h-32 sm:h-40">
                <img
                  src={mcu}
                  alt="Component"
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>

            {/* Projects */}
            <div className="mt-6">
              <h3 className="font-semibold text-xl mb-2">Projects</h3>
              {product.projects.length === 0 ? (
                <p className="text-gray-500 italic">No projects assigned</p>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
