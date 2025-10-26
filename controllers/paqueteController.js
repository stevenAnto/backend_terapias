import Paquete from "../models/Paquete.js";
import Sesion from "../models/Sesion.js";
import Persona from "../models/Persona.js";

/**
 * Crea un paquete y sus sesiones automáticamente
 */
const diasSemanaMap = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6
};

export const crearPaquete = async (req, res) => {
  try {
    const {
      nombre_paquete,
      tutor,
      ninio,
      horarios,       // Array de { dia_semana, hora }
      fecha_inicio,
      numero_sesiones,
    } = req.body;

    // Validar que tutor y niño existan
    const tutorExistente = await Persona.findById(tutor);
    const ninioExistente = await Persona.findById(ninio);
    if (!tutorExistente || !ninioExistente) {
      return res.status(404).json({ error: "Tutor o niño no encontrado" });
    }

    // Crear paquete
    const nuevoPaquete = new Paquete({
      nombre_paquete,
      tutor,
      ninio,
      horarios,
      fecha_inicio,
      numero_sesiones,
    });

    await nuevoPaquete.save();

    // Generar sesiones según días y repetir semanalmente
    const sesiones = [];
    let sesionesCreadas = 0;
    const fechaInicio = new Date(fecha_inicio);

    while (sesionesCreadas < numero_sesiones) {
      for (let h of horarios) {
        if (sesionesCreadas >= numero_sesiones) break;

        // Calcular fecha de la sesión actual
        const fechaSesion = new Date(fechaInicio);
        const diaObjetivo = diasSemanaMap[h.dia_semana];

        // Ajustar al día de la semana correcto
        const diff = (diaObjetivo + 7 - fechaSesion.getDay()) % 7;
        fechaSesion.setDate(fechaSesion.getDate() + diff);

        // Ajustar la hora
        const [horas, minutos] = h.hora.split(":").map(Number);
        fechaSesion.setHours(horas, minutos, 0, 0);

        sesiones.push({
          ninio: nuevoPaquete.ninio,
          paquete: nuevoPaquete._id,
          numero_sesion: sesionesCreadas + 1,
          fecha: fechaSesion
        });

        sesionesCreadas++;
      }

      // Avanzar fechaInicio 7 días para la próxima semana
      fechaInicio.setDate(fechaInicio.getDate() + 7);
    }

    await Sesion.insertMany(sesiones);

    // Actualizar fecha_fin del paquete
    nuevoPaquete.fecha_fin = sesiones[sesiones.length - 1].fecha;
    await nuevoPaquete.save();

    res.status(201).json({
      mensaje: "✅ Paquete y sesiones creadas correctamente",
      paquete: nuevoPaquete,
      sesiones_creadas: sesiones.length,
      sesiones
    });

  } catch (error) {
    console.error("Error al crear paquete:", error);
    res.status(500).json({ error: error.message });
  }
};
/**
 * Obtener todos los paquetes
 */
export const obtenerPaquetes = async (req, res) => {
  try {
    const paquetes = await Paquete.find()
      .populate("tutor", "nombre apellido tipo_persona")
      .populate("ninio", "nombre apellido tipo_persona");
    res.json(paquetes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener un paquete por ID
 */
export const obtenerPaquetePorId = async (req, res) => {
  try {
    const paquete = await Paquete.findById(req.params.id)
      .populate("tutor", "nombre apellido")
      .populate("ninio", "nombre apellido");

    if (!paquete) return res.status(404).json({ error: "Paquete no encontrado" });

    // Traer también las sesiones relacionadas
    const sesiones = await Sesion.find({ paquete: paquete._id });
    res.json({ paquete, sesiones });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar en tu archivo de controladores (paqueteController.js)

/**
 * Eliminar un paquete por ID
 */
export const eliminarPaquete = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el paquete
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    // Eliminar todas las sesiones asociadas al paquete
    await Sesion.deleteMany({ paquete: id });

    // Eliminar el paquete
    await Paquete.findByIdAndDelete(id);

    res.json({ 
      mensaje: "✅ Paquete y sesiones asociadas eliminadas correctamente",
      paquete_eliminado: paquete 
    });

  } catch (error) {
    console.error("Error al eliminar paquete:", error);
    res.status(500).json({ error: error.message });
  }
};


export const actualizarPaquete = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_paquete,
      tutor,
      ninio,
      fecha_inicio,
      fecha_fin,
      numero_sesiones,
      horarios,
    } = req.body;

    // Buscar paquete
    const paquete = await Paquete.findById(id);
    if (!paquete) {
      return res.status(404).json({ error: "Paquete no encontrado" });
    }

    // Actualizar campos básicos
    if (nombre_paquete) paquete.nombre_paquete = nombre_paquete;
    if (tutor) paquete.tutor = tutor;
    if (ninio) paquete.ninio = ninio;
    if (fecha_inicio) paquete.fecha_inicio = fecha_inicio;
    if (fecha_fin) paquete.fecha_fin = fecha_fin;
    if (numero_sesiones) paquete.numero_sesiones = numero_sesiones;
    if (horarios && Array.isArray(horarios)) paquete.horarios = horarios;

    await paquete.save();

    res.json({
      mensaje: "✅ Paquete actualizado correctamente",
      paquete,
    });
  } catch (error) {
    console.error("Error al actualizar paquete:", error);
    res.status(500).json({ error: error.message });
  }
};