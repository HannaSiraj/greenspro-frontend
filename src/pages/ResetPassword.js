// src/pages/ResetPassword.js
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // token from URL

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setType("success");
      setMessage("Password reset successful. You can now log in.");
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
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Set New Password
        </h2>

        {message && (
          <p className={`text-sm mb-4 text-center ${type === "success" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
