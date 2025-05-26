import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import updateIcon from "../assets/update.png";
// import deleteIcon from "../assets/delete.png";
import ProductModal from "./mincomponents/productModal";
import { FaSearch } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // or whatever page size you want
  const [totalItems, setTotalItems] = useState(0);

  // Called on form submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, query); // fetch page 1 with current query
  };

  useEffect(() => {
    //fetchProducts(page, query);
    fetchProducts(page, "");
  }, [page]);

  // const getProducts = async () => {
  //   try {
  //     const res = await fetch("http://localhost:3001/api/products", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await res.json();

  //     if (res.status === 200) {
  //       setProductData(data);
  //     } else {
  //       console.log("Something went wrong. Please try again.");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchProducts = async (pageNumber = 1, searchQuery = "") => {
    const offset = (pageNumber - 1) * pageSize;

    try {
      const res = await fetch("http://localhost:8009/search_all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          limit: pageSize,
          offset,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setProductData(data.matches);
        setTotalItems(data.total);
        setPage(pageNumber);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    const response = await fetch(
      `http://localhost:3001/api/products/deleteproduct/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const deletedata = await response.json();

    if (response.status === 422 || !deletedata) {
      console.log("Error");
    } else {
      console.log("Product deleted");
      if (
        (productData.length === 1 || totalItems - 1 <= (page - 1) * pageSize) &&
        page > 1
      ) {
        fetchProducts(page - 1, query);
      } else {
        fetchProducts(page, query);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Components Inventory</h1>
        <NavLink
          to="/insertproduct"
          className="bg-teal-600 text-white px-4 py-2 rounded text-lg hover:bg-teal-700"
        >
          + Add New Component
        </NavLink>
      </div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative py-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-2 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            aria-label="Search"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
        </div>
      </form>
      <div className="overflow-auto mt-2 max-h-[38rem] rounded-lg shadow-md border border-gray-300">
        <table className="min-w-full text-left text-lg border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b px-5 py-3 text-gray-600 font-semibold uppercase tracking-wide select-none"></th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Component Name
              </th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Component Price
              </th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Stock
              </th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Component Barcode
              </th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Update
              </th>
              <th className="border-b px-5 py-3 text-center text-gray-600 font-semibold uppercase tracking-wide select-none">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {productData.map((element, id) => (
              <tr
                key={element._id}
                className={`cursor-pointer transition-colors duration-200 ${
                  id % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-100`}
                onClick={() => setSelectedProductId(element._id)}
                tabIndex={0} // makes row focusable for keyboard users
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedProductId(element._id);
                }} // accessible row select on keyboard
                aria-label={`Select product ${element.ProductName}`}
              >
                <td className="border-b px-5 py-3">
                  {(page - 1) * pageSize + id + 1}
                </td>

                <td className="border-b px-5 py-3 text-center">
                  {element.ProductName}
                </td>
                <td className="border-b px-5 py-3 text-center">
                  {element.ProductPrice.toFixed(2)}
                </td>
                <td className="border-b px-5 py-3 text-center">
                  {element.stockLeft}
                </td>
                <td className="border-b px-5 py-3 text-center">
                  {element.ProductBarcode}
                </td>
                <td className="border-b px-5 py-3 text-center">
                  <NavLink
                    to={`/updateproduct/${element._id}`}
                    aria-label={`Update ${element.ProductName}`}
                  >
                    {/* <img
                      src={updateIcon}
                      alt="Update"
                      className="w-7 h-7 mx-auto cursor-pointer hover:text-indigo-600 transition"
                    /> */}
                    <GrUpdate className="w-6 h-6  mx-auto cursor-pointer hover:text-teal-600 transition" />
                  </NavLink>
                </td>
                <td className="border-b px-5 py-3 text-center">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(element._id);
                    }}
                    aria-label={`Delete ${element.ProductName}`}
                    className="inline-block transition border-none bg-transparent"
                  > */}
                  {/* <img
                      src={deleteIcon}
                      alt="Delete"
                      className="w-6 h-6 mx-auto cursor-pointer"
                    /> */}
                  <MdDelete
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProduct(element._id);
                    }}
                    className="w-7 h-7 mx-auto cursor-pointer hover:text-red-600 transition"
                  />
                  {/* </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="overflow-auto mt-6 max-h-[38rem]">
        <table className="min-w-full text-left text-lg border border-gray-300">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2 text-center">Component Name</th>
              <th className="border px-4 py-2 text-center">Component Price</th>
              <th className="border px-4 py-2 text-center">Stock</th>
              <th className="border px-4 py-2 text-center">
                Component Barcode
              </th>
              <th className="border px-4 py-2 text-center">Update</th>
              <th className="border px-4 py-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {productData.map((element, id) => (
              <tr
                key={element._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedProductId(element._id)}
              >
                <td className="border px-4 py-2">{id + 1}</td>
                <td className="border px-4 py-2 text-center">
                  {element.ProductName}
                </td>
                <td className="border px-4 py-2 text-center">
                  {element.ProductPrice}
                </td>
                <td className="border px-4 py-2 text-center">
                  {element.stockLeft}
                </td>
                <td className="border px-4 py-2 text-center">
                  {element.ProductBarcode}
                </td>
                <td className="border px-4 py-2 text-center">
                  <NavLink to={`/updateproduct/${element._id}`}>
                    <img
                      src={updateIcon}
                      alt="Update"
                      className="w-7 h-7 mx-auto cursor-pointer"
                    />
                  </NavLink>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => deleteProduct(element._id)}>
                    <img
                      src={deleteIcon}
                      alt="Update"
                      className="w-7 h-7 mx-auto cursor-pointer"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => fetchProducts(page - 1, query)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.ceil(totalItems / pageSize)}
        </span>

        <button
          disabled={page === Math.ceil(totalItems / pageSize)}
          onClick={() => fetchProducts(page + 1, query)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
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
