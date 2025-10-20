import Persona from "../models/Persona.js";

// 🧩 Crear persona
export const crearPersona = async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📋 Listar todas las personas
export const listarPersonas = async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Obtener persona por ID
export const obtenerPersona = async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) return res.status(404).json({ error: "Persona no encontrada" });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✏️ Actualizar persona
export const actualizarPersona = async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(persona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🗑️ Eliminar persona
export const eliminarPersona = async (req, res) => {
  try {
    await Persona.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Persona eliminada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔎 Buscar persona por DNI
export const buscarPersonaPorDni = async (req, res) => {
  try {
    const { dni } = req.params;
    const persona = await Persona.findOne({ dni });

    if (!persona) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }

    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};