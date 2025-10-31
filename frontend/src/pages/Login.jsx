import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/"); // redirect ke homee
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-gray-100">
      <div className="mb-32 mt-14 text-5xl font-bold">Task Manager</div>
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-gray-700 text-white px-4 py-2 w-full rounded hover:bg-gray-800 transition">
          Login
        </button>
      </form>
    </div>
  );
}
