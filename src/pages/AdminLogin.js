import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // clear previous errors

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <form
        onSubmit={handleAdminLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Admin Login</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
        }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Back to Home Button */}
      <button
        onClick={handleBackHome}
        className="mt-4 text-sm text-black hover:underline"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default AdminLogin;









