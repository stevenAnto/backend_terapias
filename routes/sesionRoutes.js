import express from "express";
import {
  actualizarSesion,
  obtenerSesionesPorPaquete,
  eliminarSesionesPorPaquete,
  obtenerTodasLasSesiones,
} from "../controllers/sesionController.js";

const router = express.Router();
router.get("/", obtenerTodasLasSesiones);


// 🧾 Obtener todas las sesiones de un paquete
router.get("/:paqueteId", obtenerSesionesPorPaquete);

// ✏️ Actualizar una sesión (estado, notas o fecha)
router.patch("/:id", actualizarSesion);

// Eliminar todas las sesiones de un paquete
router.delete("/:paqueteId", eliminarSesionesPorPaquete);

export default router;