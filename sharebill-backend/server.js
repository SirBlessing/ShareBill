require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const app = express();

/* ─── MIDDLEWARE ────────────────────────────
   Must come BEFORE routes so body-parsing
   and CORS headers are applied to every req.
─────────────────────────────────────────── */
app.use(cors({
  origin: process.env.https://sharebillng.netlify.app || "http://localhost:5173", // Fallback to local Vite port
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));   // 10 mb covers base64 receipt images
app.use(express.urlencoded({ extended: true }));

/* ─── ROUTES ────────────────────────────────
   All routes BEFORE app.listen().
   Having them after listen() is the classic
   Express footgun — the route stack is built
   before the server accepts any connections,
   but Node.js requires the synchronous order.
─────────────────────────────────────────── */
const authRoutes  = require("./routes/auth");
const billsRoutes = require("./routes/bills");

app.use("/auth",  authRoutes);
app.use("/bills", billsRoutes);

/* Health-check — useful for Render deploy later */
app.get("/", (req, res) => res.json({ status: "ShareBill API running ✅" }));

/* 404 catch-all */
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

/* Global error handler */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/* ─── START ─────────────────────────────────
   Use PORT from .env if set, fall back to 5000.
─────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ShareBill server running on http://localhost:${PORT}`);
});