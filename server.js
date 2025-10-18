import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import personaRoutes from "./routes/personasRoutes.js";
import paqueteRoutes from "./routes/paqueteRoutes.js";
import sesionRoutes from "./routes/sesionRoutes.js";

dotenv.config();

const app = express();

// 🧩 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 👀 Middleware para ver datos recibidos (solo este, no dupliques)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    console.log("🧾 Body recibido:", req.body);
  }
  next();
});

// 🚏 Rutas
app.use("/persona", personaRoutes);
app.use("/paquetes", paqueteRoutes);
app.use("/sesiones", sesionRoutes);

// 🔌 Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// 🚀 Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));


