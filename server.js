// ─────────────────────────────────────────
//  GREENGRAPH Tax Agent — Proxy Server
//  Sits between the browser and Anthropic API.
//  Your API key lives here — never in the HTML.
//
//  Setup:
//    npm install express cors
//    ANTHROPIC_API_KEY=sk-ant-... node server.js
//
//  Or create a .env file:
//    ANTHROPIC_API_KEY=sk-ant-...
//    PORT=3000
//  Then: node server.js
//
//  In config.js set: USE_PROXY: true, PROXY_URL: "http://localhost:3000/api/claude"
// ─────────────────────────────────────────

require("dotenv").config(); // optional — loads .env if present

const express = require("express");
const cors    = require("cors");

const app  = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is not set.");
  console.error("Set it in a .env file or pass it when starting: ANTHROPIC_API_KEY=sk-ant-... node server.js");
  process.exit(1);
}

// ── CORS — restrict to your own domain when deploying ──
// For local dev, allow all origins.
// For production, replace with: cors({ origin: "https://yourdomain.com" })
app.use(cors());
app.use(express.json({ limit: "20mb" })); // 20mb to allow PDF uploads

// ── Health check ──
app.get("/health", (req, res) => {
  res.json({ status: "ok", mode: "proxy", timestamp: new Date().toISOString() });
});

// ── Anthropic proxy ──
app.post("/api/claude", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: { message: "Proxy server error: " + err.message } });
  }
});

// ── Serve the app files (optional — lets you open the app via http://localhost:3000) ──
app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`\nGREENGRAPH Tax Agent proxy running on http://localhost:${PORT}`);
  console.log(`API key: ${API_KEY.slice(0, 12)}...${API_KEY.slice(-4)} (${API_KEY.length} chars)`);
  console.log(`\nOpen the app: http://localhost:${PORT}/greengraph-with-outputs.html\n`);
});
