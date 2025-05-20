// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function InsertProject() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleNameChange = (e) => setName(e.target.value);
//   const handleDescriptionChange = (e) => setDescription(e.target.value);

//   const addProject = async (e) => {
//     e.preventDefault();

//     if (!name) {
//       setError("Project name is required.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(
//         "http://localhost:3001/api/projects/insertproject",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ name, description }),
//         }
//       );

//       const data = await res.json();

//       if (res.status === 201) {
//         alert("Project Created Successfully!");
//         navigate("/projects");
//       } else {
//         setError("Failed to create project.");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again later.");
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 px-4">
//       <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
//       <form onSubmit={addProject} className="space-y-5">
//         <div>
//           <label
//             htmlFor="projectName"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Project Name
//           </label>
//           <input
//             type="text"
//             id="projectName"
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={name}
//             onChange={handleNameChange}
//             required
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="projectDescription"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Project Description
//           </label>
//           <textarea
//             id="projectDescription"
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={description}
//             onChange={handleDescriptionChange}
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Creating..." : "Create Project"}
//         </button>
//       </form>
//       {error && <div className="text-red-600 mt-4">{error}</div>}
//     </div>
//   );
// }

import React, { useState } from "react";

export default function InsertProject({ onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const addProject = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:3001/api/projects/insertproject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, description }),
        }
      );

      if (res.status === 201) {
        alert("Project Created Successfully!");
        if (onSuccess) onSuccess(); // Notify parent to close modal and refresh list
      } else {
        setError("Failed to create project.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={addProject} className="space-y-5">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="projectDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Project Description
          </label>
          <textarea
            id="projectDescription"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}
