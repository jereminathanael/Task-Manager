import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import TaskCard from "../components/TaskCard";
import EmptyState from "../components/EmptyState";

const statusOptions = ["Semua", "Belum Dimulai", "Sedang Dikerjakan", "Selesai"];

const Home = ({ title }) => {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/");
      setTasks(res.data || []);
    })();
  }, []);

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const filteredTasks = filterStatus === "Semua" ? tasks : tasks.filter((t) => t.status === filterStatus);

  return (
    <div className="px-4 mt-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded">
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-8">
          <EmptyState />
          <h2 className="mt-6 text-xl font-semibold text-slate-800">Tidak Ada Daftar Task</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">Tidak ada task. Coba lagi nanti atau tambahkan data baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTasks.map((t, idx) => (
            <TaskCard
              key={idx}
              id={t.id}
              title={t.title}
              forMember={t.for_member}
              description={t.description}
              statusTask={t.status}
              createdAt={t.created_at}
              startDate={t.start_date}
              endDate={t.end_date}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
