// ─────────────────────────────────────────
//  GREENGRAPH Tax Agent — Configuration
//  Safe for web deployment — no API key stored here.
//  Users enter their Anthropic API key in the sidebar.
//
//  For local use only:
//    Set ANTHROPIC_API_KEY to your key and the sidebar input disappears.
//    Never commit a real key to GitHub.
//
//  For proxy mode (Option 2 — server deployment):
//    Set USE_PROXY: true and PROXY_URL to your server endpoint.
//    The API key then lives in your server .env file only.
// ─────────────────────────────────────────

window.GREENGRAPH_CONFIG = {

  // Leave empty for web deployment — users enter their own key in the sidebar.
  // For local use only: paste your key here (never commit to GitHub).
  ANTHROPIC_API_KEY: "",

  // Set to true when running the Node.js proxy server (server.js).
  // The app will call PROXY_URL instead of api.anthropic.com directly.
  USE_PROXY: false,

  // Proxy server URL — only used when USE_PROXY is true.
  PROXY_URL: "http://localhost:3000/api/claude",

};
