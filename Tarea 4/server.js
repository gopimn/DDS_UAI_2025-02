const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const stripDots = (s) => (s || "").replace(/\./g, "");
const groupThousands = (digits) => {
  let r = "", c = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    r = digits[i] + r; c++;
    if (c === 3 && i !== 0) { r = "." + r; c = 0; }
  }
  return r;
};

// Cálculo del DV siguiendo los 7 pasos que nos dieron
function calcularDV_desglosado(cuerpoDigits) {
  // derecha a izquierda
  const reversed = cuerpoDigits.split("").reverse().map(Number);
  // serie 2..7 repetida
  const serie = [2,3,4,5,6,7];
  const productos = reversed.map((dig, idx) => dig * serie[idx % 6]);
  // 4) suma
  const suma = productos.reduce((a,b) => a + b, 0);
  // 5) división
  const q = Math.floor(suma / 11);
  const prod11 = q * 11;
  const resto = Math.abs(suma - prod11);
  // 6) 11 - resto
  const onceMenosResto = 11 - resto;
  // 7) mapeo
  let dv;
  if (onceMenosResto === 11) dv = "0";
  else if (onceMenosResto === 10) dv = "K";
  else dv = String(onceMenosResto);

  return { reversed, productos, suma, q, prod11, resto, onceMenosResto, dv };
}


app.post("/api/dv", (req, res) => {
  try {
    let rutBody = (req.body.rutBody || "").toString().toUpperCase();
    rutBody = rutBody.replace(/[^0-9.]/g, "");
    const cuerpo = stripDots(rutBody);

    if (!/^\d{1,8}$/.test(cuerpo)) {
      return res.status(400).json({ error: "El cuerpo del RUT debe tener entre 1 y 8 dígitos." });
    }

    const r = calcularDV_desglosado(cuerpo);
    const cuerpoFormateado = groupThousands(cuerpo);
    const rutCompleto = `${cuerpoFormateado}-${r.dv}`;

    res.json({
      dv: r.dv,
      rutBody: cuerpo,
      rutFormateado: cuerpoFormateado,
      rutCompleto,
      pasos: {
        reversed: r.reversed,
        productos: r.productos,
        suma: r.suma,
        divisionEntera: r.q,
        producto11: r.prod11,
        resto: r.resto,
        onceMenosResto: r.onceMenosResto
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error interno calculando DV" });
  }
});


app.get("/api/dv", (req, res) => {
  req.body = { rutBody: req.query.rut || "" };
  return app._router.handle(req, res, "POST");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API y cliente corriendo en http://localhost:${PORT}`);
});
