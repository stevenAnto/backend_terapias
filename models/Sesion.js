import mongoose from "mongoose";

const sesionSchema = new mongoose.Schema({
  paquete: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Paquete", 
    required: true 
  },

  ninio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persona",
    required: true, // cada sesión pertenece a un niño
  },

  numero_sesion: { type: Number, required: true },
  fecha: { type: Date, required: true },

  // Nuevo: asistencia como booleano
  asistio: { 
    type: Boolean, 
    default: null // null significa que aún no se registró la asistencia
  },

  // Estado de la sesión
  estado: { 
    type: String, 
    enum: ["pendiente", "perdido", "reprogramado"], 
    default: "pendiente" 
  },

  // Cuántas veces se ha reprogramado
  reprogramaciones: { 
    type: Number, 
    default: 0, 
    min: 0 
  },

  notas: { type: String, default: "" }

}, { timestamps: true });

// Índice único por paquete + número de sesión
sesionSchema.index({ paquete: 1, numero_sesion: 1 }, { unique: true });

export default mongoose.model("Sesion", sesionSchema);
