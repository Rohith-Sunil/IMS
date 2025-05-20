import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profilePic from "../assets/profile.png";

export default function Navbar({ title }) {
  return (
    <nav className="bg-teal-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-white text-2xl font-bold select-none">
              {title}
            </span>
          </Link>
        </div>

        {/* Right: Navigation Links & Profile */}
        <div className="flex items-center space-x-6">
          <ul className="hidden md:flex space-x-6 text-white text-lg font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/purchases"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Purchases
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Components
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="hover:text-gray-300 transition-colors duration-200"
              >
                Search
              </Link>
            </li>
          </ul>

          <button
            aria-label="User Profile"
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-black hover:border-teal-600 hover:bg-teal-600 transition-colors cursor-pointer"
            title="User Profile"
            // Add onClick or Link for profile if needed
          >
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
