import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.approved) {
          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              email,
              is_approved: data.approved,
              username: data.username,
            })
          );
          setMessage("login successful");
          setMessageType("success");

          setTimeout(() => {
            navigate("/landing");
          }, 1500);
        } else {
          setMessage("Your account is not approved by admin yet.");
          setMessageType("error");
        }
      } else {
        setMessage(` ${data.message || "Login failed"}`);
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Message shown before the form */}
      {message && (
        <p
          className={`mb-4 text-sm font-medium text-center ${
            messageType === "success" ? "text-green-600" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </form>

      {/* Back to Home link below the form */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 text-black hover:underline"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default Login;




