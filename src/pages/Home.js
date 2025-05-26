// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black space-y-12 p-6">
      
//       {/* User Access Section */}
//       <section
//         aria-label="User access panel"
//         className="text-center bg-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md"
//       >
//         <h1 className="text-3xl font-bold mb-4">Welcome to Bladerunner</h1>
//         <p className="mb-6">Access your personal dashboard.</p>
//         <div className="flex justify-center space-x-4">
//           <button
//             aria-label="Launch platform - Login"
//             onClick={() => navigate("/login")}
//             className="bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition"
//           >
//             Launch Platform
//           </button>

//           <button
//             aria-label="Create a new account - Signup"
//             onClick={() => navigate("/signup")}
//             className="bg-white text-black font-semibold px-6 py-3 rounded-full border hover:bg-gray-200 transition"
//           >
//             Create Account
//           </button>
//         </div>
//       </section>

//       {/* Admin Access Section */}
//       <section
//         aria-label="Admin access panel"
//         className="text-center bg-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
//         <p className="mb-6">Login to manage user approvals.</p>
//         <button
//           aria-label="Admin login"
//           onClick={() => navigate("/admin-login")}
//           className="w-full bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition"
//         >
//           Admin Login
//         </button>
//       </section>
      
//     </main>
//   );
// }

// export default Home;

import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black space-y-12 p-6">
      
      {/* User Access */}
      <section
        aria-label="User access panel"
        className="text-center bg-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-4">Welcome to Bladerunner</h1>
        <p className="mb-6">Access your personal dashboard.</p>
        <div className="flex justify-center space-x-4">
          <button
            aria-label="Launch platform - Login"
            onClick={() => navigate("/login")}
            className="bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Launch Platform
          </button>

          <button
            aria-label="Create a new account - Signup"
            onClick={() => navigate("/signup")}
            className="bg-white text-black font-semibold px-6 py-3 rounded-full border hover:bg-gray-200 transition"
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Admin Access */}
      <section
        aria-label="Admin access panel"
        className="text-center bg-gray-100 rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Admin Portal</h2>
        <p className="mb-6">Login to manage user approvals.</p>
        <button
          aria-label="Admin login"
          onClick={() => navigate("/admin-login")}
          className="w-full bg-black text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition"
        >
          Admin Login
        </button>
      </section>
      
    </main>
  );
};

export default Home;
