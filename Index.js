import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());

// ✅ 1️⃣ Health check route
app.get("/ping", (req, res) => {
  console.log("✅ /ping route hit!");
  res.status(200).send("PONG 🧠");
});

// ✅ 2️⃣ Webhook verification (GET)
app.get("/webhook", (req, res) => {
  console.log("✅ Verification request received");

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "123456";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Webhook verification failed");
    res.sendStatus(403);
  }
});

// ✅ 3️⃣ Webhook POST handler
app.post("/webhook", (req, res) => {
  console.log("📩 Webhook event received:");
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

// ✅ 4️⃣ Default fallback
app.use((req, res) => {
  console.log(`⚠️ Unknown route: ${req.method} ${req.url}`);
  res.status(404).send("Route not found");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
