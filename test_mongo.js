import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde .env

// Leer la URI desde el archivo .env
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ No se encontró la variable MONGO_URI en el archivo .env");
  process.exit(1);
}

// Intentar conectar
console.log("Intentando conectar a MongoDB...");

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Conectado exitosamente a MongoDB");
    return mongoose.connection.close(); // cerrar conexión después de probar
  })
  .then(() => {
    console.log("🔌 Conexión cerrada correctamente");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:");
    console.error(err.message);
    process.exit(1);
  });
