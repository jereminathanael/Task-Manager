import db from "../db.js";

export const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let result;

    if (status) {
      result = await db.query(`SELECT * FROM tasks WHERE status = $1 ORDER BY created_at ASC`, [status]);
    } else {
      result = await db.query(`SELECT * FROM tasks ORDER BY created_at ASC`);
    }

    let message;
    const data = result.rowCount;
    if (data === 0) {
      message = "Daftar task masih KOSONG (0)";
    } else {
      message = status ? `Daftar task dengan status ${status}` : "Daftar semua task";
    }
    res.status(200).json({ success: true, message: message, data: result.rows });
  } catch (error) {
    console.error("Error saat mengambil data task: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMe = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

export const getHistoryTask = async (req, res) => {
  const { id } = req.params;

  const result = await db.query(
    `SELECT t.title AS title, l.action AS action, l.note AS note, l.created_at AS created_at
       FROM task_logs l
       JOIN tasks t ON l.task_id = t.id
       WHERE t.id = $1
       ORDER BY l.created_at ASC`,
    [id]
  );
  const data = result.rows[0];

  if (!data) {
    return res.status(404).json({ success: false, message: "History Task tidak Ditemukan" });
  }

  try {
    const result = await db.query(
      `SELECT t.title AS title, l.action AS action, l.note AS note, l.created_at AS created_at
       FROM task_logs l
       JOIN tasks t ON l.task_id = t.id
       WHERE t.id = $1
       ORDER BY l.created_at ASC`,
      [id]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error saat mengambil history task: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'Belum Dimulai') AS belum_dimulai,
        COUNT(*) FILTER (WHERE status = 'Sedang Dikerjakan') AS sedang_dikerjakan,
        COUNT(*) FILTER (WHERE status = 'Selesai') AS selesai,
        COUNT(*) AS total_task
      FROM tasks;
    `);

    const summary = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Ringkasan dashboard task ringkas",
      data: {
        total_task: parseInt(summary.total_task),
        belum_dimulai: parseInt(summary.belum_dimulai),
        sedang_dikerjakan: parseInt(summary.sedang_dikerjakan),
        selesai: parseInt(summary.selesai),
      },
    });
  } catch (error) {
    console.error("Error saat mengambil ringkasan task:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createTask = async (req, res) => {
  const { title, forMember, description, startDate, endDate } = req.body;

  if (!title || !forMember || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: "Silahkan isi semua inputan nya" });
  }

  try {
    const result = await db.query(
      `INSERT INTO tasks (title, for_member, description, start_date, end_date) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, forMember, description, startDate, endDate]
    );

    const newTask = result.rows[0];
    const taskId = newTask.id;
    // membuat log / masukkan ke riwayat tugas
    await db.query(
      `INSERT INTO task_logs (task_id, action, note) 
      VALUES ($1, 'Task Created', 'Tugas dibuat oleh manager.')`,
      [taskId]
    );
    res.status(200).json({ success: true, data: newTask });
  } catch (error) {
    console.error("Error saat membuat task: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatedStatusTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
  const data = result.rows[0];

  if (!data) {
    return res.status(404).json({ success: false, message: "Task tidak Ditemukan" });
  }

  try {
    const old = await db.query("SELECT status FROM tasks WHERE id = $1", [id]);
    const oldStatus = old.rows[0].status;

    await db.query("UPDATE tasks SET status = $1 WHERE id = $2 ", [status, id]);

    // otomatis log perubahan status
    await db.query(
      `INSERT INTO task_logs (task_id, action, note)
      VALUES ($1, 'Status Berubah', $2)`,
      [id, `Status berubah dari "${oldStatus}" ke "${status}"`]
    );
    res.status(200).json({ success: true, message: "Status diperbarui dan log otomatis ditambahkan" });
  } catch (error) {
    console.error("Error saat mengupdate task: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
  const data = result.rows[0];

  if (!data) {
    return res.status(404).json({ success: false, message: "Task tidak Ditemukan" });
  }

  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.status(200).json({ success: true, message: "Task telah Dihapus" });
  } catch (error) {
    console.error("Error saat menghapus task: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
