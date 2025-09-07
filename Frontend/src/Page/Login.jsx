// src/pages/Login.jsx
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white relative">
      {/* Logo on top left */}
      <div className="absolute top-6 left-6">
        <a href="/">
          {/* Replace src with your logo path if needed */}
          <img
            src="https://ik.imagekit.io/lxvqyrkjo/Group%201.svg?updatedAt=1757267388277"
            alt="Logo"
            className="h-10 w-auto"
            
          />
        </a>
      </div>
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>
        <p className="text-sm text-gray-300 text-center mb-6">
          Welcome back! Please login to your account
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900 bg-opacity-30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email 
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email or username"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-700 bg-black text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-700 bg-black text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-400 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
