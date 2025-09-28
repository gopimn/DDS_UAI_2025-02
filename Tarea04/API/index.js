// index.js
const cors = require("cors");
const express = require("express");
const app = express(); 

app.use(express.json()); //escribir datos en JSON
app.use(cors())


function calcularDigitoVerificador(rut) {
    // Remover puntos y guiones, convertir a string
    const rutLimpio = rut.toString().replace(/[.-]/g, "");

    // Validar que solo contenga números
    if (!/^\d+$/.test(rutLimpio)) {
        throw new Error("RUT debe contener solo números");
    }

    // Convertir a array de números
    const digitos = rutLimpio.split("").map(Number).reverse();

    // Multiplicadores: 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 7, ...
    let suma = 0;
    let multiplicador = 2;

    for (let i = 0; i < digitos.length; i++) {
        suma += digitos[i] * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    // Calcular el dígito verificador
    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return "0";
    if (dv === 10) return "K";
    return dv.toString();
}

// api rut 
app.post("/rut", (peticion, res) => {
    const rut = peticion.body?.RUT;
    const digitoVerificador = calcularDigitoVerificador(rut);
    res.json({
        digitoVerificador: digitoVerificador
    });
});

app.listen(3000, () => console.log("API lista en http://localhost:3000"));

