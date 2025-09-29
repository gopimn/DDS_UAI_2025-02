const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'html')));

function calcularDigitoVerificador(rut) {
    let suma = 0;
    let multiplicador = 2;
    
    rut = rut.replace(/\./g, '');
    
    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const digito = 11 - resto;

    if (digito === 11) return '0';
    if (digito === 10) return 'K';
    return digito.toString();
}

app.post('/api/digito-verificador', (req, res) => {
    const { rut } = req.body;
    
    if (!rut) {
        return res.status(400).json({ error: 'RUT es requerido' });
    }

    try {
        const digito = calcularDigitoVerificador(rut);
        res.json({ digito });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular dígito verificador' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});