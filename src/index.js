// src/index.js
import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// 🔹 Webhook verification (Meta handshake)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "123456"; // same token you put in Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 🔹 Handle incoming webhook events
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook event:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Meta webhook server running on port ${PORT}`);
});
