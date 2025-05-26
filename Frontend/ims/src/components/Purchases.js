import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

function Purchases() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [newRequest, setNewRequest] = useState({
    productId: "",
    productName: "",
    shortage: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/purchase/log-purchase-request",
        {
          ...newRequest,
          shortage: Number(newRequest.shortage),
        }
      );

      // Refetch or update state manually
      setRequests((prev) => [
        ...prev,
        {
          _id: Date.now().toString(), // temporary ID
          date: new Date().toISOString(),
          ...newRequest,
          shortage: Number(newRequest.shortage),
        },
      ]);
      setNewRequest({ productId: "", productName: "", shortage: "" });
    } catch (err) {
      console.error("Failed to add purchase request:", err);
      setError("Failed to add purchase request.");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/purchase/requests"
        );
        setRequests(res.data);
      } catch (err) {
        setError("Failed to fetch purchase requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleExport = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/purchase/export-purchase-requests",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "purchase_requests.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
      setError("Export failed. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/purchase/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete request.");
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({
      productName: requests[index].productName,
      shortage: requests[index].shortage,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:3001/api/purchase/requests/${id}`,
        editData
      );
      const updated = [...requests];
      updated[editIndex] = { ...updated[editIndex], ...editData };
      setRequests(updated);
      setEditIndex(null);
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update request.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold">Purchase Requests</h2>
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-60 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm shadow-md mr-4"
          >
            + Add Purchase Request
          </button>

          <button
            onClick={handleExport}
            className="w-60 h-10 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm shadow-md"
          >
            <PiDownloadSimpleBold className="inline-block mr-2" />
            Download Purchase Requests
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <p>No purchase requests logged.</p>
      ) : (
        <div>
          <table className="table-auto w-full border border-collapse mt-5">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Product Name</th>
                <th className="px-4 py-2 border">Product ID</th>
                <th className="px-4 py-2 border">Shortage</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={req._id}>
                  <td className="border px-4 py-2">
                    {editIndex === idx ? (
                      <input
                        type="text"
                        value={editData.productName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            productName: e.target.value,
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      req.productName
                    )}
                  </td>
                  <td className="border px-4 py-2">{req.productId}</td>
                  <td className="border px-4 py-2">
                    {editIndex === idx ? (
                      <input
                        type="number"
                        value={editData.shortage}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            shortage: Number(e.target.value),
                          })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      req.shortage
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(req.date).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 flex gap-4 justify-center">
                    {editIndex === idx ? (
                      <button
                        onClick={() => handleUpdate(req._id)}
                        title="Save"
                      >
                        <GrUpdate className="text-green-600 w-6 h-6" />
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(idx)} title="Edit">
                        <GrUpdate className="w-6 h-6 hover:text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(req._id)}
                      title="Delete"
                    >
                      <MdDelete className="hover:text-red-600 w-7 h-7" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Add Purchase Request</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Product ID"
                value={newRequest.productId}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, productId: e.target.value })
                }
                className="border w-full rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Product Name"
                value={newRequest.productName}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, productName: e.target.value })
                }
                className="border w-full rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Shortage"
                value={newRequest.shortage}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, shortage: e.target.value })
                }
                className="border w-full rounded px-3 py-2"
              />
            </div>
            <button
              onClick={async () => {
                await handleAddRequest();
                setIsModalOpen(false);
              }}
              className="mt-6 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;
