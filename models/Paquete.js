import mongoose from "mongoose";

const diaHoraSchema = new mongoose.Schema({
  dia_semana: { type: String, required: true }, // p.ej. "Lunes"
  hora: { type: String, required: true }        // p.ej. "14:00"
}, { _id: false });

const paqueteSchema = new mongoose.Schema({
  nombre_paquete: { type: String, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  ninio: { type: mongoose.Schema.Types.ObjectId, ref: "Persona", required: true },
  horarios: { type: [diaHoraSchema], required: true }, // Array de día+hora
  fecha_contratacion: { type: Date, default: Date.now },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date },                        
  numero_sesiones: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Paquete", paqueteSchema);


