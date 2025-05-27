// import React from "react";
// import { Link } from "react-router-dom";
// import logo from "../assets/logo.png"; // Adjust the path as necessary
// import profilePic from "../assets/profile.png";

// export default function Navbar({ title }) {
//   return (
//     <nav className="bg-teal-600 shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//         {/* Left: Logo & Title */}
//         <div className="flex items-center space-x-3">
//           <Link to="/" className="flex items-center space-x-2">
//             <img src={logo} alt="Logo" className="w-8 h-8" />
//             <span className="text-white text-2xl font-bold select-none">
//               {title}
//             </span>
//           </Link>
//         </div>

//         {/* Right: Navigation Links & Profile */}
//         <div className="flex items-center space-x-6">
//           <ul className="hidden md:flex space-x-6 text-white text-lg font-medium">
//             <li>
//               <Link
//                 to="/"
//                 className="hover:text-gray-300 transition-colors duration-200"
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/purchases"
//                 className="hover:text-gray-300 transition-colors duration-200"
//               >
//                 Purchases
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/projects"
//                 className="hover:text-gray-300 transition-colors duration-200"
//               >
//                 Projects
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/products"
//                 className="hover:text-gray-300 transition-colors duration-200"
//               >
//                 Components
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/search"
//                 className="hover:text-gray-300 transition-colors duration-200"
//               >
//                 Search
//               </Link>
//             </li>
//           </ul>

//           <button
//             aria-label="User Profile"
//             className="w-8 h-8 rounded-full overflow-hidden border-2 border-black hover:border-teal-600 hover:bg-teal-600 transition-colors cursor-pointer"
//             title="User Profile"
//             // Add onClick or Link for profile if needed
//           >
//             <img
//               src={profilePic}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profilePic from "../assets/profile.png";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here (e.g. clear tokens, redirect)
    logout();
    navigate("/");
    console.log("Logging out...");
  };

  return (
    <nav className="bg-teal-600 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <Link to="/home" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-white text-2xl font-bold select-none">
              {title}
            </span>
          </Link>
        </div>

        {/* Right: Links & Profile */}
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6 text-white text-lg font-medium">
            <li>
              <Link to="/home" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="hover:text-gray-300">
                Purchases
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-gray-300">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-gray-300">
                Components
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-gray-300">
                Search
              </Link>
            </li>
          </ul>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-black hover:border-teal-400 hover:bg-teal-400 transition"
              title="User Profile"
            >
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-3 top-7 mt-2 w-30 bg-white rounded-md shadow-lg z-20">
                {/* <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:rounded-md"
                >
                  Profile
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
