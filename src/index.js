app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "123456"; // same one you typed in Meta dashboard

  // Grab query params Meta sends
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Check mode and token
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge); // ✅ Send challenge back to Meta
    } else {
      res.sendStatus(403); // ❌ Wrong token
    }
  }
});
