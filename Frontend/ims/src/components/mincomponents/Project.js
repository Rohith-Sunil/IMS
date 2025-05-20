import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";

export const UniProject = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [products, setProducts] = useState([]);
  // const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error("Error fetching project:", err));
  }, [projectId]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/projects/${projectId}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) =>
        console.error("Error fetching products for project:", err)
      );
  }, [projectId]);

  const handleAddProduct = () => {
    navigate("/insertproduct", { state: { projectId } });
  };

  if (!project)
    return <div className="p-8 text-lg font-medium">Loading project...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* <button
          onClick={() => navigate(-1)}
          className="mb-4 w-28 h-8 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 "
        >
          ←
        </button> */}
        <div className="flex flex-row  -ml-8 mb-14">
          <IoCaretBackOutline
            onClick={() => navigate(-1)}
            className="w-8 h-8 pt-1   text-gray-800 cursor-pointer hover:text-teal-600"
          />

          <h2 className="text-2xl font-bold text-gray-800 ">
            Project: {project.name}
          </h2>
        </div>
        <div className="flex flex-col">
          <button
            className="px-4 py-2 my-2 text-base bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={() => navigate(`/projects/${projectId}/update`)}
          >
            ✎ Update Project
          </button>

          <button
            className="px-4 py-2 my-2 text-base bg-teal-600 text-white rounded hover:bg-teal-700"
            onClick={handleAddProduct}
          >
            + Add Component to this Project
          </button>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-3 text-gray-700">
        Components in this Project:
      </h4>

      {products.length === 0 ? (
        <p className="text-gray-500 italic">No components assigned yet.</p>
      ) : (
        // <ul className="space-y-3">
        //   {products.map((product) => (
        //     <Link
        //       to={`/product/${product._id}`}
        //       className="block cursor-pointer"
        //     >
        //       <li
        //         key={product._id}
        //         className="p-4 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-200"
        //       >
        //         <p className="font-medium text-gray-900">
        //           {product.ProductName} — ₹{product.ProductPrice}
        //         </p>
        //         <p className="text-sm text-gray-600">
        //           Barcode: {product.ProductBarcode}
        //         </p>
        //         <p className="text-sm text-gray-600">
        //           Components Assigned:{" "}
        //           {
        //             // find the matching project object in the array
        //             (() => {
        //               const projectInfo = product.projects.find(
        //                 (p) => p.project.toString() === projectId
        //               );
        //               return projectInfo ? projectInfo.quantity : 0;
        //             })()
        //           }
        //         </p>
        //       </li>
        //     </Link>
        //   ))}
        // </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}>
              <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.ProductName}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Price: ₹{product.ProductPrice}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Barcode: {product.ProductBarcode}
                </p>
                <p className="text-sm text-gray-600">
                  Components Assigned:{" "}
                  {(() => {
                    const projectInfo = product.projects.find(
                      (p) => p.project.toString() === projectId
                    );
                    return projectInfo ? projectInfo.quantity : 0;
                  })()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
