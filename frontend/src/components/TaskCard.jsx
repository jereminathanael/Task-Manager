import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { FaTrashAlt } from "react-icons/fa";

const statusColors = {
  "Belum Dimulai": "bg-red-500",
  "Sedang Dikerjakan": "bg-yellow-500",
  Selesai: "bg-green-500",
};

const TaskCard = ({ id, title, forMember, description, statusTask, createdAt, startDate, endDate, onStatusChange, onDelete }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(statusTask);

  // menyinkronisasi status ketika prop berubah
  useEffect(() => {
    setStatus(statusTask);
  }, [statusTask]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsEditing(false);

    try {
      await apiFetch(`/task/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      onStatusChange?.(id, newStatus);
    } catch (err) {
      console.error("Gagal mengupdate status:", err);
    }
  };

  const handleDestroy = async () => {
    try {
      await apiFetch(`/task/${id}`, {
        method: "DELETE",
      });
      onDelete?.(id);
    } catch (err) {
      console.error("Gagal menghapus status:", err);
    }
  };

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white">
      <div className="flex justify-between">
        <div className="text-sm text-gray-500 mb-3">{new Date(createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
        <button onClick={handleDestroy} className="p-2 bg-red-500 hover:bg-red-600 rounded">
          <FaTrashAlt color="white" size={13} />
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-8 text-center">{title}</h3>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(`/history-task/${id}`)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
          Riwayat Task
        </button>

        <div className="flex items-center gap-1">
          {!isEditing ? (
            <div onClick={() => setIsEditing(true)} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1">
              <span className={`w-3 h-3 rounded-full ${statusColors[status] || "bg-gray-400"}`}></span>
              <span className="text-sm">{status}</span>
            </div>
          ) : (
            <select value={status} onChange={handleStatusChange} onBlur={() => setIsEditing(false)} className="border rounded p-1 text-sm" autoFocus>
              {Object.keys(statusColors).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-4 gap-2">
        <span className="border p-2 h-14 rounded-md">To: {forMember}</span>
        <span className="border p-2 h-14 rounded-md">
          Due: {new Date(startDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })} - {new Date(endDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
        </span>
      </div>

      <div className="text-gray-700 text-sm p-2 rounded-md border">{description.length === 0 ? <span className="flex justify-center text-gray-400">No Description</span> : description}</div>
    </div>
  );
};

export default TaskCard;
