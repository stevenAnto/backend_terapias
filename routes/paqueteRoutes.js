import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
  eliminarPaquete
} from "../controllers/paqueteController.js";

const router = express.Router();

router.post("/", crearPaquete);
router.get("/", obtenerPaquetes);
router.get("/:id", obtenerPaquetePorId);
router.delete('/:id', eliminarPaquete);  // ← Agregar esta ruta
router.put("/:id", actualizarPaquete); // 👈 agregar



export default router;