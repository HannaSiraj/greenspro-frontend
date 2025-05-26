import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSignup = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");

    // Basic client-side validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (username.trim().length < 3) {
      setMessage("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "Signup successful! You will be able to login only after admin approval."
        );
        // Clear inputs
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 6000);
      } else {
        // More detailed error feedback
        if (data.errors && Array.isArray(data.errors)) {
          setMessage(data.errors.map((err) => err.msg).join(", "));
        } else if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Signup failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {message && (
        <p
          role="alert"
          className={`mb-6 text-center text-sm ${
            message.toLowerCase().includes("successful")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        noValidate
        aria-label="Signup form"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Signup
        </h2>

        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md"
          required
          minLength={3}
          disabled={isLoading}
          autoComplete="username"
          aria-required="true"
        />

        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md"
          required
          disabled={isLoading}
          autoComplete="email"
          aria-required="true"
        />

        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md"
          required
          minLength={6}
          disabled={isLoading}
          autoComplete="new-password"
          aria-required="true"
        />

        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md"
          required
          minLength={6}
          disabled={isLoading}
          autoComplete="new-password"
          aria-required="true"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-white transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
          aria-busy={isLoading}
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-black underline hover:text-gray-700 focus:outline-none"
          >
            Login
          </button>
        </p>
      </form>

      <button
        onClick={() => navigate("/")}
        className="mt-6 text-black hover:underline focus:outline-none"
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default Signup;
