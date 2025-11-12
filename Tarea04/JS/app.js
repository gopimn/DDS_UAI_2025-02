const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Función para calcular el dígito verificador
function calcularDV(rut) {
  let M = 0;
  let S = 1;
  let T = parseInt(rut);
  
  while (T > 0) {
    S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    T = Math.floor(T / 10);
  }
  
  return S ? (S - 1).toString() : 'K';
}

// Endpoint POST para validar RUT
app.post('/api/validar-rut', (req, res) => {
  try {
    const { rut } = req.body;
    
    if (!rut) {
      return res.status(400).json({
        error: true,
        mensaje: 'El RUT es requerido'
      });
    }

    // Limpiar el RUT (eliminar puntos y guión)
    let rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Separar número y dígito verificador
    let numero = rutLimpio.slice(0, -1);
    let dvIngresado = rutLimpio.slice(-1).toUpperCase();

    // Calcular el dígito verificador correcto
    let dvCalculado = calcularDV(numero);

    // Validar
    const esValido = dvIngresado === dvCalculado;

    // Log para debug
    console.log(`RUT recibido: ${rut}`);
    console.log(`DV ingresado: ${dvIngresado}, DV calculado: ${dvCalculado}`);
    console.log(`Válido: ${esValido}`);

    res.json({
      valido: esValido,
      digitoVerificador: dvCalculado,
      rutIngresado: rut,
      mensaje: esValido 
        ? `✅ El RUT es válido. Dígito verificador: ${dvCalculado}` 
        : `❌ El RUT es inválido. El dígito verificador correcto es: ${dvCalculado}`
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      mensaje: 'Error al procesar el RUT',
      detalle: error.message
    });
  }
});

// Endpoint GET de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mensaje: 'API de validación de RUT funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
  console.log(`📋 Endpoint: POST http://localhost:${PORT}/api/validar-rut`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/api/health`);
});