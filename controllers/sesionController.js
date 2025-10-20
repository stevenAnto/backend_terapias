import Sesion from "../models/Sesion.js";
import Paquete from "../models/Paquete.js";
import Persona from "../models/Persona.js";



/**
 * Actualiza una sesión (estado o notas)
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

export const actualizarSesion = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, notas } = req.body;

        const sesion = await Sesion.findById(id);
        if (!sesion) return res.status(404).json({ error: "Sesión no encontrada" });

        // Reprogramar: desplazamos todas las sesiones posteriores
        if (estado === "reprogramada") {
            const sesiones = await Sesion.find({ paquete: sesion.paquete }).sort("numero_sesion");
            const fechas = sesiones.map(s => s.fecha);
            const index = sesiones.findIndex(s => s._id.equals(sesion._id));

            for (let i = index; i < sesiones.length; i++) {
                sesiones[i].fecha = fechas[i + 1] || sesiones[i].fecha;
                sesiones[i].estado = "pendiente";
                await sesiones[i].save();
            }

            // Obtener paquete
            const paquete = await Paquete.findById(sesion.paquete);
            if (!paquete) return res.status(404).json({ error: "Paquete no encontrado" });

            // Mapear días a números
            const diasNumeros = paquete.horarios.map(h => diasSemanaMap[h.dia_semana]);
            const ultimaSesion = sesiones[sesiones.length - 1];
            const ultimoDia = ultimaSesion.fecha.getDay();

            const siguienteDiaIndex = diasNumeros.findIndex(d => d > ultimoDia);
            const siguienteDiaNumero = siguienteDiaIndex !== -1 ? diasNumeros[siguienteDiaIndex] : diasNumeros[0];

            let diferencia = (siguienteDiaNumero - ultimoDia + 7) % 7;
            diferencia = diferencia === 0 ? 7 : diferencia;

            const proximaFecha = new Date(ultimaSesion.fecha);
            proximaFecha.setDate(proximaFecha.getDate() + diferencia);

            const horarioObj = paquete.horarios[siguienteDiaIndex !== -1 ? siguienteDiaIndex : 0];
            const [horas, minutos] = horarioObj.hora.split(":").map(Number);
            proximaFecha.setHours(horas, minutos, 0, 0);

            ultimaSesion.fecha = proximaFecha;
            await ultimaSesion.save();

            return res.json({
                mensaje: "Sesión reprogramada y sesiones posteriores actualizadas",
                sesion
            });
        }

        // Si no es reprogramada, actualizar normalmente
        if (estado) sesion.estado = estado;
        if (notas) sesion.notas = notas;
        await sesion.save();

        res.json(sesion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Listar sesiones por paquete
 */
export const obtenerSesionesPorPaquete = async (req, res) => {
    try {
        const { paqueteId } = req.params;
        const sesiones = await Sesion.find({ paquete: paqueteId }).sort("numero_sesion").populate("ninio", "nombre dni celular");
        res.json(sesiones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las sesiones de todos los paquetes
export const obtenerTodasLasSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find()
      .populate("paquete", "nombre_paquete fecha_inicio fecha_fin") // trae info del paquete
      .populate("ninio", "nombre dni"); // trae info del niño
    
    res.status(200).json(sesiones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener las sesiones" });
  }
};
/**
 * Eliminar todas las sesiones de un paquete
 */
export const eliminarSesionesPorPaquete = async (req, res) => {
    try {
        const { paqueteId } = req.params;

        // Borra todas las sesiones del paquete
        const resultado = await Sesion.deleteMany({ paquete: paqueteId });

        res.json({
            mensaje: `Se eliminaron ${resultado.deletedCount} sesiones del paquete`,
            paqueteId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// DELETE /sesiones -> elimina todas las sesiones
// Controlador para eliminar todas las sesiones
// controllers/sesionController.js
export const eliminarTodasLasSesiones = async (req, res) => {
  try {
    await Sesion.deleteMany({});
    res.status(200).json({ message: 'Todas las sesiones han sido eliminadas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const obtenerSesionesPorDniNinio = async (req, res) => {
  try {
    const { dni } = req.params;

    // Primero encontramos al niño por su DNI
    const ninio = await Persona.findOne({ dni });
    console.log("ninio",ninio);
    if (!ninio) {
      return res.status(404).json({ mensaje: "Niño no encontrado con ese DNI" });
    }

    // Luego buscamos las sesiones asociadas a ese niño
    const sesiones = await Sesion.find({ ninio: ninio._id })
      .populate("ninio", "nombre dni")
      .populate("paquete", "nombre_paquete fecha_inicio fecha_fin");

    if (sesiones.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron sesiones para este DNI" });
    }

    res.status(200).json(sesiones);
  } catch (error) {
    console.error("Error al obtener sesiones por DNI:", error);
    res.status(500).json({ error: "Error al obtener las sesiones del niño" });
  }
};

