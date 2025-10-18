import express from "express";
import {
  crearPaquete,
  obtenerPaquetes,
  obtenerPaquetePorId,
} from "../controllers/paqueteController.js";

const router = express.Router();

router.post("/", crearPaquete);
router.get("/", obtenerPaquetes);
router.get("/:id", obtenerPaquetePorId);

export default router;