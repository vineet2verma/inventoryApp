"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoginUserFunc } from "../context/loginuser";
import LoadingSpinner from "./waiting";

export default function SignInPage() {
  const [loading, setLoading] = useState(false); // initially false
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setuser } = LoginUserFunc();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email : email.toLowerCase() , password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        const tokendata = await fetch("api/tokenvarify", {
          method: "GET",
          cache: "no-store",
        });

        const dt = await tokendata.json();
        setuser(dt);

        // Optional: Short delay before navigation
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        alert("Login failed: " + data.message);
        setLoading(false); // Stop loading if failed
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
