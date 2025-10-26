import fs from "fs";
import fetch from "node-fetch";

const URL = "http://localhost:4000/persona";

// Leer el archivo personas.json
const personas = JSON.parse(fs.readFileSync("./personas.json", "utf8"));

async function crearPersonas() {
  for (const persona of personas) {
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(persona)
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`❌ Error al crear ${persona.nombre}:`, text);
        continue;
      }

      const data = await res.json();
      console.log(`✅ Creado: ${persona.nombre} (id: ${data._id || "sin id"})`);
    } catch (err) {
      console.error(`❌ Error con ${persona.nombre}:`, err.message);
    }
  }
}

crearPersonas();
