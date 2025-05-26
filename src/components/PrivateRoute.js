import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const getStoredItem = (key, fallback = {}) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const isUserApproved = (user) => {
  return user.isApproved === true || user.is_approved === true;
};

const PrivateRoute = ({ admin = false }) => {
  const location = useLocation();

  const token = localStorage.getItem(admin ? "adminToken" : "token");
  const user = getStoredItem(admin ? "adminUser" : "user");

  if (!token) {
    return (
      <Navigate
        to={admin ? "/admin-login" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  if (admin && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (!admin && user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (!admin && !isUserApproved(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center p-6 bg-yellow-100 text-yellow-800 rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Awaiting Admin Approval</h2>
          <p>Your account is pending admin approval. Please wait to be approved.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;



