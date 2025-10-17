import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "task_manager",
  password: process.env.password,
  port: 5432,
});

try {
  db.connect();
  console.log("✅ Database connected");
} catch (err) {
  console.error("❌ Database connection error:", err.message);
}

export default db;
