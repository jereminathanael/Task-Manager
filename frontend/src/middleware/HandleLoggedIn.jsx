import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HandleLoggedIn = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
        <div className="flex flex-col items-center p-4 bg-white shadow-md rounded">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 mb-2"></div>
          <p className="text-gray-700 font-semibold">Loading, mohon tunggu...</p>
        </div>
      </div>
    );

  if (user) return <Navigate to="/" replace />;
  return children;
};

export default HandleLoggedIn;
