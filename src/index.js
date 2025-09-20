import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "default_token"; // fallback if not set

// Webhook verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.error("❌ Verification failed. Invalid token.");
    res.sendStatus(403);
  }
});

// Webhook events (POST)
app.post("/webhook", (req, res) => {
  try {
    const body = req.body;
    console.log("📩 Incoming webhook event:", JSON.stringify(body, null, 2));
    res.sendStatus(200);
  } catch (err) {
    console.error("⚠️ Error processing webhook:", err);
    res.sendStatus(500);
  }
});

// ✅ FIX: Use Render’s dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
