import fs from "fs";
import fetch from "node-fetch";

const URL = "http://localhost:4000/paquetes";

// Leer el archivo paquetes.json
const paquetes = JSON.parse(fs.readFileSync("paquetes.json", "utf8"));

// Función para registrar un paquete
async function crearPaquete(paquete) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error al crear ${paquete.nombre_paquete}:`, errorText);
      return;
    }

    const data = await response.json();
    console.log(`✅ ${paquete.nombre_paquete} creado correctamente:`, data._id || data.id || data);
  } catch (error) {
    console.error(`⚠️ Error de red al crear ${paquete.nombre_paquete}:`, error.message);
  }
}

// Ejecutar todo en secuencia
(async () => {
  for (const paquete of paquetes) {
    await crearPaquete(paquete);
  }
  console.log("🎯 Registro de paquetes completado.");
})();
