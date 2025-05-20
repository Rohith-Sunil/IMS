import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
//import { Link } from "react-router-dom";
import mcu from "../assets/mcu.png";
import { FaSearch } from "react-icons/fa";
import ProductModal from "./mincomponents/productModal";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Search() {
  const queryParam = useQuery();
  const initialQuery = queryParam.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        const sortedProducts = data.sort((a, b) => a.distance - b.distance);
        setProducts(sortedProducts);
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-4">Search Components</h2>

      {/* <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Search
        </button>
      </form> */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
          >
            <FaSearch />
          </button>
        </div>
      </form>
      <div className="overflow-scroll-y">
        <ul className="space-y-4 ">
          {products.length === 0 ? (
            <li className="bg-gray-100 px-4 py-3 rounded border text-gray-700">
              No products found.
            </li>
          ) : (
            products.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between bg-white px-4 py-3 rounded shadow border hover:bg-gray-200"
              >
                {/* Content on the left */}
                <div className="flex-1 mr-4">
                  {/* <Link
                    to={`/product/${product._id}`}
                    className="block cursor-pointer"
                  >
                    <strong className="text-lg">{product.ProductName}</strong> —
                    ₹{product.ProductPrice}
                    <div className="text-sm text-gray-600 mt-1">
                      Barcode: {product.ProductBarcode}
                    </div>
                    <div className="text-sm text-gray-500">
                      Distance: {product.distance.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dimension: {product.dimension}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stockLeft}
                    </div>
                  </Link> */}

                  <div
                    onClick={() => setSelectedProductId(product._id)}
                    className="block cursor-pointer"
                  >
                    <strong className="text-lg">{product.ProductName}</strong> —
                    ₹{product.ProductPrice}
                    <div className="text-sm text-gray-600 mt-1">
                      Barcode: {product.ProductBarcode}
                    </div>
                    <div className="text-sm text-gray-500">
                      Distance: {product.distance.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dimension: {product.dimension}
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stockLeft}
                    </div>
                  </div>
                </div>

                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={mcu}
                    alt="Component"
                    className="w-full h-full object-cover rounded "
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      {selectedProductId && (
        <ProductModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
