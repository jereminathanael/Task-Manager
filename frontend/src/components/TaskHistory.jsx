import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";

const TaskHistory = () => {
  const { id } = useParams();
  const [histories, setHistories] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch(`/task/${id}/history`);
      setHistories(res.data || []);
    })();
  }, []);

  const title = histories[0]?.title || "";

  return (
    <div className="px-4 mt-20">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Riwayat Task {title}</h2>
        <Link to="/" className="p-3 border rounded-md">
          Back To Home
        </Link>
      </div>

      <div>
        {histories.length === 0 ? (
          <p>Tidak ada history dari task ini</p>
        ) : (
          <ul>
            {histories.map((h, idx) => (
              <div key={idx} className="mb-6 ml-6 relative">
                <span className="absolute -left-5 top-4 w-4 h-4 rounded-full bg-gray-500 border-2 border-white"></span>
                {/* konten dari note */}
                <div className="bg-gray-100 p-3 rounded shadow-sm">
                  <p className="text-gray-700">{h.note}</p>
                  {h.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(h.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskHistory;
