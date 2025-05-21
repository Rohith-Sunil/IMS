import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirm_password } = form;

    if (!name || !email || !password || !confirm_password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Something went wrong, try again");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-neutral-50 via-white to-neutral-50 min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-500" />

      <div className="z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Sign Up
        </h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "confirm_password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-1 capitalize"
              >
                {field.replace("_", " ")}
              </label>
              <input
                id={field}
                type={field.includes("password") ? "password" : "text"}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder={
                  field.includes("password")
                    ? "••••••••"
                    : `Enter ${field.replace("_", " ")}`
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md font-semibold transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-teal-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
