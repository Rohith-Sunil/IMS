import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoCaretBackOutline } from "react-icons/io5";

function UpdateProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjectAndProducts = async () => {
      try {
        // Fetch project info
        const projectRes = await fetch(
          `http://localhost:3001/api/projects/${id}`
        );
        const projectData = await projectRes.json();

        setName(projectData.name);
        setDescription(projectData.description);

        // Fetch components assigned to the project
        const productsRes = await fetch(
          `http://localhost:3001/api/projects/${id}/products`
        );
        const productsData = await productsRes.json();

        setComponents(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching project or products:", err);
        setError("Failed to load project data.");
      }
    };

    fetchProjectAndProducts();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/projects/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description }),
        }
      );

      if (res.ok) {
        alert("Project updated successfully.");
        navigate("/projects");
      } else {
        setError("Failed to update project.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred.");
    }
  };

  const handleRemoveComponent = async (componentId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/projects/${id}/remove-component/${componentId}`,
        {
          method: "PUT",
        }
      );

      if (res.ok) {
        setComponents((prev) =>
          prev.filter((comp) => comp._id !== componentId)
        );
      } else {
        setError("Failed to remove component.");
      }
    } catch (err) {
      console.error("Remove error:", err);
      setError("An error occurred.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-row  -ml-8">
        <IoCaretBackOutline
          onClick={() => navigate(-1)}
          className="w-8 h-8 pt-1   text-gray-800 cursor-pointer hover:text-teal-600"
        />
        <h1 className="text-2xl font-bold mb-4">Update Project</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block font-medium mb-1">Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        Save Changes
      </button>

      <div className="">
        {" "}
        <h2 className="text-xl font-semibold mt-10 mb-4">
          Assigned Components
        </h2>
        {components.length === 0 ? (
          <p className="text-gray-500">No components assigned.</p>
        ) : (
          <ul className="space-y-3">
            {components.map((comp) => (
              <li
                key={comp._id}
                className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
              >
                <span>{comp.ProductName}</span>
                <button
                  onClick={() => handleRemoveComponent(comp._id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UpdateProject;
