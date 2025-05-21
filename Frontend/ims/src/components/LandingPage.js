import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactTyped as Typed } from "react-typed";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-neutral-50 via-white to-neutral-50 min-h-screen text-white overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-500"></div>
      <div className="absolute bottom-30 right-40 w-[200px] h-[200px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-500"></div>
      <div className="absolute bottom-12 right-82 w-[200px] h-[200px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-50 right-70 w-[200px] h-[200px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-500"></div>
      <div className="absolute bottom-30 right-40 w-[200px] h-[200px] bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-500"></div>

      {/* Main Content Overlay */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 py-6">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-4">
          <h1 className="text-4xl font-bold text-gray-900 drop-shadow-lg">
            IMS <span className="text-teal-400 font-poppins">Pro.</span>
          </h1>
          <div className="space-x-4 hidden md:flex">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md bg-teal-400 hover:bg-teal-500 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-md bg-teal-400 hover:bg-teal-500 transition"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="h-[90vh] flex flex-col justify-center items-center text-center">
          <div className="backdrop-blur-md bg-white/10 p-10 rounded-xl  animate-fade-in-down">
            <p className="text-teal-400 font-semibold mb-4 tracking-wide">
              SMART INVENTORY MANAGEMENT
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
              Streamline Your <br /> Product & Project Flow
            </h1>
            <div className="flex justify-center items-center text-2xl md:text-3xl mb-4">
              <span className="mr-2 text-gray-900">Built for</span>
              <Typed
                strings={[
                  "Developers",
                  "Institutes",
                  "Startups",
                  "Enterprises",
                ]}
                typeSpeed={80}
                backSpeed={50}
                loop
                className="text-teal-400 font-bold"
              />
            </div>
            <p className="text-gray-900 mb-6 max-w-[600px] mx-auto">
              Centralize inventory across multiple projects with powerful
              analytics, real-time tracking, and seamless control.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Get Started
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-gray-300 py-10 px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} IMS Pro. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
