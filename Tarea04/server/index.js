// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Función para calcular el dígito verificador
function calcularDigitoVerificador(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    let numeros = rut.slice(0, -1);
    let dvIngresado = rut.slice(-1).toUpperCase();
    let numerosInvertidos = numeros.split('').reverse();
    let serie = [2, 3, 4, 5, 6, 7];
    let suma = 0;

    for (let i = 0; i < numerosInvertidos.length; i++) {
        suma += parseInt(numerosInvertidos[i]) * serie[i % serie.length];
    }

    let resto = suma % 11;
    let digito = 11 - resto;

    if (digito === 11) digito = '0';
    else if (digito === 10) digito = 'K';
    else digito = digito.toString();

    return digito === dvIngresado;
}

// Endpoint para validar el RUT y devolver el dígito verificador
app.post('/api/validar-rut', (req, res) => {
    const rut = req.body.rut;
    const valido = calcularDigitoVerificador(rut);
    const digito = rut.slice(-1).toUpperCase();
    res.json({ valido, digito });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
