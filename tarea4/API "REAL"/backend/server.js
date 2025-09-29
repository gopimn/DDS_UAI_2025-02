const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // servir frontend

// Función para calcular DV
function calcularDV(numero) {
  let suma = 0, mult = 2;
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += Number(numero[i]) * mult;
    mult = (mult === 7) ? 2 : mult + 1;
  }
  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return String(dv);
}

// Endpoint de la API
app.get("/api/calcular-dv", (req, res) => {
  const { rut } = req.query;

  if (!rut || !/^\d+$/.test(rut)) {
    return res.status(400).json({ error: "El RUT debe ser numérico y sin DV." });
  }

  const dv = calcularDV(rut);
  res.json({ rut, dv, rutCompleto: `${rut}-${dv}` });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
