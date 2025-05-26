import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import InsertProject from "./InsertProject";
import { useNavigate } from "react-router-dom";
import Preview from "../assets/randomProject.png"; // Adjust the path as necessary

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  const closeModal = () => setShowInsertModal(false);

  const handleProjectCreated = () => {
    fetch("http://localhost:3001/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
    setShowInsertModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={() => setShowInsertModal(true)}
          className="bg-teal-600 text-white px-5 py-2 rounded-lg shadow hover:bg-teal-700 transition"
        >
          + Add New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 italic">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="bg-white rounded-2xl p-5 border shadow hover:shadow-md transition transform hover:-translate-y-1"
            >
              <div className="mb-3 h-40 w-full overflow-hidden rounded-lg ">
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg group">
                  {/* Static image */}
                  <img
                    src={Preview}
                    alt="Project preview"
                    className="w-38 h-40 object-cover transition-opacity duration-300 group-hover:opacity-0 mx-auto"
                  />

                  {/* GIF image */}
                  <img
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdG44Y3Q0cHZraDFqbDh6aGNtandmeGlmZnByZDBiZWkyMTcwNm01dyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/qm5AAaWg9zH85FvUP2/giphy.gif"
                    alt="GIF preview"
                    className="absolute inset-0 w-38 h-40 object-cover transition-opacity duration-3000 opacity-0 group-hover:opacity-100 mx-auto my-auto"
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 mb-4 line-clamp-3">
                {project.description || "No description provided."}
              </p>
              {/* <Link
                to={`/projects/${project._id}`}
                className="inline-block bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700 transition"
              >
                View Project
              </Link> */}
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {showInsertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full max-h-[90vh] relative overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close modal"
              type="button"
            >
              &times;
            </button>
            <InsertProject onSuccess={handleProjectCreated} />
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function Projects() {
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3001/api/projects")
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Projects</h2>
//         <Link
//           to="/insertproject"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           + Add New Project
//         </Link>
//       </div>

//       <ul className="space-y-3">
//         {projects.map((project) => (
//           <li
//             key={project._id}
//             className="flex justify-between items-center bg-white shadow px-4 py-3 rounded border"
//           >
//             <span className="text-lg">{project.name}</span>
//             <Link
//               to={`/projects/${project._id}`}
//               className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
//             >
//               View
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// // Import InsertProject or define it here
// import InsertProject from "./InsertProject";

// export default function Projects() {
//   const [projects, setProjects] = useState([]);
//   const [showInsertModal, setShowInsertModal] = useState(false);

//   useEffect(() => {
//     fetch("http://localhost:3001/api/projects")
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Close modal handler
//   const closeModal = () => setShowInsertModal(false);

//   // Callback after project creation to refresh project list and close modal
//   const handleProjectCreated = () => {
//     // Refetch projects to get updated list
//     fetch("http://localhost:3001/api/projects")
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error(err));
//     setShowInsertModal(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold">Projects</h2>
//         <button
//           onClick={() => setShowInsertModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           + Add New Project
//         </button>
//       </div>

//       <ul className="space-y-3">
//         {projects.map((project) => (
//           <li
//             key={project._id}
//             className="flex justify-between items-center bg-white shadow px-4 py-3 rounded border"
//           >
//             <span className="text-lg">{project.name}</span>
//             <a
//               href={`/projects/${project._id}`}
//               className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
//             >
//               View
//             </a>
//           </li>
//         ))}
//       </ul>

//       {/* Modal Popup */}
//       {showInsertModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-lvh relative">
//             <button
//               onClick={closeModal}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//               aria-label="Close modal"
//               type="button"
//             >
//               &times;
//             </button>
//             {/* Pass callback to InsertProject to notify on success */}
//             <InsertProject onSuccess={handleProjectCreated} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
