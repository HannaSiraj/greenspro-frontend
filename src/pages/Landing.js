import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ install this if not already

function Landing() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Auto logout if token expired
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white relative flex flex-col items-center justify-center p-8 text-black">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
      >
        Logout
      </button>

      <h1 className="text-4xl font-extrabold mb-6">
        Welcome, {user?.username || "Pilot"}
      </h1>

      <p className="text-center max-w-xl mb-12 text-lg leading-relaxed">
        BladeRunner is a cutting-edge platform for advanced engine performance optimization and analysis.
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="bg-black text-white px-10 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 transition"
      >
        Explore the Dashboard
      </button>
    </div>
  );
}

export default Landing;


