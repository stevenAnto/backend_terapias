import mongoose from "mongoose";

// 1️⃣ Definimos el esquema (estructura del documento)
const personaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // obligatorio
    trim: true      // elimina espacios extra
  },
  dni: {
    type: String,
    required: true,
    unique: true    // evita duplicados
  },
  celular: {
    type: String,
    default: ""     // puede ser vacío
  }
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

// 2️⃣ Creamos el modelo a partir del esquema
const Persona = mongoose.model("Persona", personaSchema);

// 3️⃣ Exportamos el modelo para usarlo en otros archivos
export default Persona;