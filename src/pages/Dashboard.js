import React from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", performance: 40 },
  { name: "Feb", performance: 55 },
  { name: "Mar", performance: 70 },
  { name: "Apr", performance: 60 },
  { name: "May", performance: 80 },
];

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black relative">
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="performance" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
