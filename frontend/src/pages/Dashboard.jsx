import { useEffect, useState } from "react";
import { apiFetch } from "../api/api.js";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_task: 0,
    belum_dimulai: 0,
    sedang_dikerjakan: 0,
    selesai: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiFetch("/dashboard");
        if (res.success) setSummary(res.data);
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="mt-20 px-4">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="mb-10">
        {/* Total Task */}
        <div className="bg-blue-100 border border-blue-300 rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Task</h3>
          <p className="text-4xl font-bold text-blue-800">{summary.total_task}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Belum Selesai */}
        <div className="bg-red-100 border border-red-300 rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Belum Selesai</h3>
          <p className="text-4xl font-bold text-red-800">{summary.belum_dimulai}</p>
        </div>

        {/* Sedang Dikerjakan */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-700 mb-2">Sedang Dikerjakan</h3>
          <p className="text-4xl font-bold text-yellow-800">{summary.sedang_dikerjakan}</p>
        </div>

        {/* Selesai */}
        <div className="bg-green-100 border border-green-300 rounded-2xl p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Selesai</h3>
          <p className="text-4xl font-bold text-green-800">{summary.selesai}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
