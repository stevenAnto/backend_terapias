import express from "express";
import {
  crearPersona,
  listarPersonas,
  obtenerPersona,
  actualizarPersona,
  eliminarPersona,
  buscarPersonaPorDni
} from "../controllers/personaController.js";

const router = express.Router();

// POST → crear persona
router.post("/", crearPersona);

// GET → listar todas
router.get("/", listarPersonas);

// GET → obtener una persona por ID
router.get("/:id", obtenerPersona);

// PUT → actualizar
router.put("/:id", actualizarPersona);

// DELETE → eliminar
router.delete("/:id", eliminarPersona);

router.get("/dni/:dni", buscarPersonaPorDni);


export default router;

