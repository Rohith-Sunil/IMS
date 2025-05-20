import React, { useEffect, useState } from "react";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { RiAlignItemBottomLine } from "react-icons/ri";
import { GoProject } from "react-icons/go";
import { FiShoppingCart } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

// Colors for the chart
const COLORS = ["#2dd4bf", "#f87171"]; // In Stock: teal, Out of Stock: red

export default function Home() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productspie, setProducts] = useState([]);

  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const projectsRes = await fetch("http://localhost:3001/api/projects");
        const projects = await projectsRes.json();

        const productsRes = await fetch("http://localhost:3001/api/products");
        const products = await productsRes.json();
        setProducts(products);

        const purchaseRes = await fetch(
          "http://localhost:3001/api/purchase/requests"
        );
        const purchaseRequests = await purchaseRes.json();

        setTotalProjects(projects.length);
        setTotalProducts(products.length);
        setPendingOrders(purchaseRequests.length);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stockStatusData = [
    {
      name: "In Stock",
      value: productspie.filter((p) => p.stockLeft > 0).length,
    },
    {
      name: "Out of Stock",
      value: productspie.filter((p) => p.stockLeft === 0).length,
    },
  ];

  const downloadExcel = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/purchase/export-purchase-requests"
      );
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "purchase_requests.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download Excel file:", err);
      alert("Something went wrong while downloading the file.");
    }
  };

  if (loading) return <div className="p-10">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-red-600">{error}</div>;

  return (
    <div className="w-full px-5 py-10 bg-gray-50 min-h-screen ">
      {/* Summary cards */}
      <div className=" mx-auto my-auto  m-1 block w-full  rounded-lg">
        <div className="grid bg-gray-50 grid-cols-3 gap-6 mb-8">
          <div
            onClick={(e) => {
              navigate("/projects");
            }}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <GoProject className=" text-4xl mx-auto" />
            <p className="text-gray-600 uppercase text-base mb-2 tracking-wide">
              Total Projects
            </p>
            <p className="text-4xl font-extrabold text-teal-600">
              {totalProjects}
            </p>
          </div>
          <div
            onClick={(e) => {
              navigate("/products");
            }}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <RiAlignItemBottomLine className=" text-4xl mx-auto" />
            <p className="text-gray-600 uppercase text-base mb-2 tracking-wide">
              Total Components
            </p>
            <p className="text-4xl font-extrabold text-teal-600">
              {totalProducts}
            </p>
          </div>
          <div
            onClick={(e) => {
              navigate("/purchases");
            }}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
          >
            <FiShoppingCart className=" text-4xl mx-auto" />
            <p className="text-gray-600 uppercase text-base mb-2 tracking-wide">
              Components Requests Pending
            </p>
            <p className="text-4xl font-extrabold text-teal-600">
              {pendingOrders}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={downloadExcel}
        className="bg-teal-600 text-white px-6 py-8 rounded-lg hover:bg-teal-700 transition font-semibold shadow-md mx-auto block"
      >
        <PiDownloadSimpleBold className="text-4xl mx-auto" />
        Download Purchase Requests
      </button>

      <div className="w-full md:w-1/2 mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Component Stock Status
        </h2>
        <div className="focus:outline-none">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                className="focus:outline-none"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
