// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === API TOKEN SPOTIFY ===
app.post("/api/token", async (req, res) => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(req.body).toString(),
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error("❌ Error en /api/token:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// === SERVIR FRONTEND (VITE BUILD) ===
const frontendPath = path.join(__dirname, "dist");
app.use(express.static(frontendPath));

// Cualquier otra ruta → React
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API no encontrada" });
  }
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);
