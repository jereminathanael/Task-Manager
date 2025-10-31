import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoute.js";
import db from "./db.js";
import bcrypt from "bcrypt";
import session from "express-session";
import { authMiddleware } from "./middleware/authmiddleware.js";

// otomatis membuat akun manager saat server startup
(async () => {
  const result = await db.query("SELECT * FROM users WHERE role='manager'");
  const rows = result.rowCount;
  if (rows === 0) {
    const hash = await bcrypt.hash("12345", 10);
    await db.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3)", ["User123", hash, "manager"]);
    console.log("Default akun manager: username=User123, password=12345");
  } else {
    console.log("Manager akun sudah ada");
  }
})();

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
// konfigurasi session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 62,
    }, // 1 jam 2 menit
  })
);

// LOGIN & LOGOUT
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, message: "Username tidak ditemukan" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Password salah" });
    }

    // membuat session user
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.json({
      success: true,
      message: "Login berhasil",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error saat login: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: "Logout berhasil" });
});

app.use(authMiddleware);

app.use("/", taskRoutes);

app.listen(port, () => {
  console.log(`Your server is start at http://localhost:${port}/`);
});
