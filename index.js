// index.js (Final Production Version)
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(bodyParser.json());

// ✅ PostgreSQL Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Webhook verification route (Meta)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ Webhook message receiver
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("Webhook received:", JSON.stringify(body, null, 2));

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log("Message event:", webhookEvent);
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// ✅ Test route for deployment verification
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Meta Webhook Server Live & Running on Render!");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is live on port ${PORT}`);
});
