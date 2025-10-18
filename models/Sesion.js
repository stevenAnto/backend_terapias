import mongoose from "mongoose";

const sesionSchema = new mongoose.Schema({
  paquete: { type: mongoose.Schema.Types.ObjectId, ref: "Paquete", required: true },
  ninio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persona",
      required: true, // 👈 obligatorio si cada sesión pertenece a un niño
    },
  numero_sesion: { type: Number, required: true },
  fecha: { type: Date, required: true },
  estado: { type: String, enum: ["pendiente","asistio","no_asistio","reprogramada"], default: "pendiente" },
  notas: { type: String, default: "" }
}, { timestamps: true });

// índice único por paquete + número de sesión
sesionSchema.index({ paquete: 1, numero_sesion: 1 }, { unique: true });

export default mongoose.model("Sesion", sesionSchema);

