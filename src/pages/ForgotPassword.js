// src/pages/ForgotPassword.js
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill email if passed via navigation state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      setType("success");
      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setType("error");
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>

        {message && (
          <p className={`text-sm mb-4 text-center ${type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          onClick={() => navigate("/login")}
          type="button"
          className="mt-4 text-sm text-blue-600 hover:underline block w-full text-center"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
