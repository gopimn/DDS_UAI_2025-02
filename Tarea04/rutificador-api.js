// Simple Express API para calcular el dígito verificador de un RUT
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

function calcularDV(rut) {
    rut = rut.replace(/\./g, '');
    if (!/^\d{7,8}$/.test(rut)) return null;
    let suma = 0, multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    let dv = 11 - (suma % 11);
    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
}

app.post('/api/dv', (req, res) => {
    const { rut } = req.body;
    const dv = calcularDV(rut);
    if (dv === null) {
        return res.status(400).json({ error: 'Formato de RUT inválido' });
    }
    res.json({ dv });
});

app.listen(PORT, () => {
    console.log(`API RUTificador escuchando en http://localhost:${PORT}`);
});
