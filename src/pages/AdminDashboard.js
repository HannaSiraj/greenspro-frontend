import { useEffect, useState, useCallback } from "react";
import { FaTrashAlt, FaCheck, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_URL = process.env.REACT_APP_API_URL;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logoutMsg, setLogoutMsg] = useState("");
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
  if (!token) return;  // <-- ADD THIS LINE: don't fetch if no token

  try {
    const res = await fetch(`${API_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    setUsers(data);
  } catch (err) {
    console.error("Error fetching users:", err.message);
  }
}, [token]);

useEffect(() => {
  if (token) {       // <-- ADD THIS CHECK to only fetch when token exists
    fetchUsers();
  } else {
    setUsers([]);    // Optional: clear users on logout
  }
}, [fetchUsers, token]);

  const toggleApproval = async (id, is_approved, username) => {
    const result = await MySwal.fire({
      title: is_approved ? "Disapprove user?" : "Approve user?",
      text: `Are you sure you want to ${is_approved ? "disapprove" : "approve"} "${username}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#38a169",
      cancelButtonColor: "#6c757d",
      confirmButtonText: is_approved ? "Disapprove" : "Approve",
      cancelButtonText: "Cancel",
      width: 360,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/admin/approve/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approved: !is_approved }),
        });

        if (!res.ok) throw new Error("Failed to update approval");
        await fetchUsers();

        await MySwal.fire({
          icon: "success",
          title: is_approved ? "Disapproved" : "Approved",
          text: `"${username}" has been ${is_approved ? "disapproved" : "approved"}.`,
          timer: 1300,
          showConfirmButton: false,
          width: 300,
        });
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          width: 300,
        });
      }
    }
  };

  const deleteUser = async (id, username) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: `Delete user "${username}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      width: 350,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to delete user");
        await fetchUsers();

        await MySwal.fire({
          icon: "success",
          title: "Deleted!",
          text: `"${username}" has been removed.`,
          timer: 1200,
          showConfirmButton: false,
          width: 300,
        });
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
          width: 300,
        });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLogoutMsg("Logout successful!");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-semibold text-gray-600">Admin Portal</h1>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 transition"
          title="Logout"
          aria-label="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>

      {/* Logout message */}
      {logoutMsg && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 rounded-md text-center font-semibold">
          {logoutMsg}
        </div>
      )}

      {/* Table Box */}
      <div className="bg-white p-6 rounded-md shadow-lg overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
              <th className="border border-gray-300 p-3 text-left">Name</th>
              <th className="border border-gray-300 p-3 text-left">Email</th>
              <th className="border border-gray-300 p-3 text-center">Status</th>
              <th className="border border-gray-300 p-3 text-center">Approval</th>
              <th className="border border-gray-300 p-3 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(({ id, username, email, is_approved }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{username}</td>
                  <td className="border border-gray-300 p-3">{email}</td>
                  <td className="border border-gray-300 p-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        is_approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => toggleApproval(id, is_approved, username)}
                      className="p-2 rounded focus:outline-none hover:bg-gray-200"
                      title={is_approved ? "Disapprove User" : "Approve User"}
                      aria-label={is_approved ? "Disapprove User" : "Approve User"}
                    >
                      {is_approved ? <FaTimes size={20} /> : <FaCheck size={20} />}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => deleteUser(id, username)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete user"
                      aria-label={`Delete user ${username}`}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;



// import { useEffect, useState, useCallback } from "react";
// import { FaTrashAlt, FaCheck, FaTimes, FaSignOutAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);
// const API_URL = process.env.REACT_APP_API_URL;

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [actionLoadingId, setActionLoadingId] = useState(null); // to disable specific buttons
//   const [logoutMsg, setLogoutMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const token = localStorage.getItem("adminToken");
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("adminToken");
//     setLogoutMsg("Logout successful!");
//     setTimeout(() => {
//       navigate("/");
//     }, 1000);
//   };

//   const fetchUsers = useCallback(async () => {
//     if (!token) return;

//     setLoading(true);
//     setErrorMsg("");
//     try {
//       const res = await fetch(`${API_URL}/api/admin/users`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.status === 401 || res.status === 403) {
//         // Token expired or unauthorized - force logout
//         logout();
//         return;
//       }

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to fetch users");
//       setUsers(data);
//     } catch (err) {
//       setErrorMsg(err.message);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [token, logout]);

//   useEffect(() => {
//     if (token) {
//       fetchUsers();
//     } else {
//       setUsers([]);
//     }
//   }, [fetchUsers, token]);

//   const toggleApproval = async (id, is_approved, username) => {
//     const result = await MySwal.fire({
//       title: is_approved ? "Disapprove user?" : "Approve user?",
//       text: `Are you sure you want to ${is_approved ? "disapprove" : "approve"} "${username}"?`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#38a169",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: is_approved ? "Disapprove" : "Approve",
//       cancelButtonText: "Cancel",
//       width: 360,
//     });

//     if (result.isConfirmed) {
//       setActionLoadingId(id);
//       try {
//         const res = await fetch(`${API_URL}/api/admin/approve/${id}`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ approved: !is_approved }),
//         });

//         if (res.status === 401 || res.status === 403) {
//           logout();
//           return;
//         }

//         if (!res.ok) throw new Error("Failed to update approval");
//         await fetchUsers();

//         await MySwal.fire({
//           icon: "success",
//           title: is_approved ? "Disapproved" : "Approved",
//           text: `"${username}" has been ${is_approved ? "disapproved" : "approved"}.`,
//           timer: 1300,
//           showConfirmButton: false,
//           width: 300,
//         });
//       } catch (err) {
//         MySwal.fire({
//           icon: "error",
//           title: "Error",
//           text: err.message,
//           width: 300,
//         });
//       } finally {
//         setActionLoadingId(null);
//       }
//     }
//   };

//   const deleteUser = async (id, username) => {
//     const result = await MySwal.fire({
//       title: "Are you sure?",
//       text: `Delete user "${username}"?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#e3342f",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Yes, delete!",
//       cancelButtonText: "Cancel",
//       width: 350,
//     });

//     if (result.isConfirmed) {
//       setActionLoadingId(id);
//       try {
//         const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.status === 401 || res.status === 403) {
//           logout();
//           return;
//         }

//         if (!res.ok) throw new Error("Failed to delete user");
//         await fetchUsers();

//         await MySwal.fire({
//           icon: "success",
//           title: "Deleted!",
//           text: `"${username}" has been removed.`,
//           timer: 1200,
//           showConfirmButton: false,
//           width: 300,
//         });
//       } catch (err) {
//         MySwal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: err.message,
//           width: 300,
//         });
//       } finally {
//         setActionLoadingId(null);
//       }
//     }
//   };

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4">
//       {/* Top Bar */}
//       <div className="flex justify-between items-center my-6">
//         <h1 className="text-2xl font-semibold text-gray-600">Admin Portal</h1>
//         <button
//           onClick={handleLogout}
//           className="text-gray-600 hover:text-red-600 transition"
//           title="Logout"
//           aria-label="Logout"
//           disabled={loading || actionLoadingId !== null}
//         >
//           <FaSignOutAlt size={24} />
//         </button>
//       </div>

//       {/* Logout message */}
//       {logoutMsg && (
//         <div className="mb-4 p-3 text-green-800 bg-green-100 rounded-md text-center font-semibold">
//           {logoutMsg}
//         </div>
//       )}

//       {/* Error message */}
//       {errorMsg && (
//         <div className="mb-4 p-3 text-red-800 bg-red-100 rounded-md text-center font-semibold">
//           {errorMsg}
//         </div>
//       )}

//       {/* Loading indicator */}
//       {loading ? (
//         <div className="text-center p-10 text-gray-600 font-semibold">Loading users...</div>
//       ) : (
//         <div className="bg-white p-6 rounded-md shadow-lg overflow-x-auto">
//           <table className="min-w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
//                 <th className="border border-gray-300 p-3 text-left">Name</th>
//                 <th className="border border-gray-300 p-3 text-left">Email</th>
//                 <th className="border border-gray-300 p-3 text-center">Status</th>
//                 <th className="border border-gray-300 p-3 text-center">Approval</th>
//                 <th className="border border-gray-300 p-3 text-center">Delete</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map(({ id, username, email, is_approved }) => (
//                   <tr key={id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 p-3">{username}</td>
//                     <td className="border border-gray-300 p-3">{email}</td>
//                     <td className="border border-gray-300 p-3 text-center">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                           is_approved
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {is_approved ? "Approved" : "Pending"}
//                       </span>
//                     </td>
//                     <td className="border border-gray-300 p-3 text-center">
//                       <button
//                         onClick={() => toggleApproval(id, is_approved, username)}
//                         className="p-2 rounded focus:outline-none hover:bg-gray-200"
//                         title={is_approved ? "Disapprove User" : "Approve User"}
//                         aria-label={is_approved ? "Disapprove User" : "Approve User"}
//                         disabled={actionLoadingId === id}
//                       >
//                         {is_approved ? <FaTimes size={20} /> : <FaCheck size={20} />}
//                       </button>
//                     </td>
//                     <td className="border border-gray-300 p-3 text-center">
//                       <button
//                         onClick={() => deleteUser(id, username)}
//                         className="text-red-600 hover:text-red-800 transition"
//                         title="Delete user"
//                         aria-label={`Delete user ${username}`}
//                         disabled={actionLoadingId === id}
//                       >
//                         <FaTrashAlt size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="text-center p-4 text-gray-500">
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;
