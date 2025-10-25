import express from "express";
import {
  actualizarSesion,
  obtenerSesionesPorPaquete,
  eliminarSesionesPorPaquete,
  obtenerTodasLasSesiones,
  eliminarTodasLasSesiones,
  obtenerSesionesPorDniNinio,
  actualizarAsistencia
} from "../controllers/sesionController.js";

const router = express.Router();
router.get("/", obtenerTodasLasSesiones);


// 🧾 Obtener todas las sesiones de un paquete
router.get("/:paqueteId", obtenerSesionesPorPaquete);

// ✏️ Actualizar una sesión (estado, notas o fecha)
router.patch("/:id", actualizarSesion);
router.patch("/sesiones/:id/asistencia", actualizarAsistencia);


// Eliminar todas las sesiones de un paquete
router.delete("/:paqueteId", eliminarSesionesPorPaquete);
router.delete('/',eliminarTodasLasSesiones );
router.get("/dni/:dni", obtenerSesionesPorDniNinio);

export default router;