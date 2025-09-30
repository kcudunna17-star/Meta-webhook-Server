import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(express.json());

// ✅ PostgreSQL connection pool
const pool = new Pool({
  user: "kc",             // your db username
  host: "localhost",      // since it's running on Termux
  database: "postgres",   // default db name
  password: "65116028",   // the password you gave "kc"
  port: 5432,             // default PostgreSQL port
});

// Test route: fetch users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM test_users");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Keep your webhook routes here
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "default_token";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook event:", req.body);
  res.sendStatus(200);
});

// ✅ Render/Termux dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
