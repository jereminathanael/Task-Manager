// src/pages/CreateTask.jsx
import { useState } from "react";
import { apiFetch } from "../api/api.js";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    forMember: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/task", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.success) {
        setForm({ title: "", forMember: "", description: "", startDate: "", endDate: "" });
        navigate("/");
      } else {
        alert("‼️" + res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-24">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Create Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Judul Task</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg p-2" required />
          </div>

          <div>
            <label className="block font-medium mb-1">Untuk Member</label>
            <input type="text" name="forMember" value={form.forMember} onChange={handleChange} className="w-full border rounded-lg p-2" required />
          </div>

          <div>
            <label className="block font-medium mb-1">Deskripsi</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2" rows="3" required></textarea>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Tanggal Mulai</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>

            <div className="flex-1">
              <label className="block font-medium mb-1">Tanggal Selesai</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border rounded-lg p-2" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-3 bg-black text-white p-2 rounded-lg hover:opacity-80 transition">
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
