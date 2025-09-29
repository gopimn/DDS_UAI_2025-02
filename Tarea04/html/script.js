const API_URL = 'http://localhost:3000/api/validar-rut';

// Validación del formulario con API
document.getElementById("rutForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const rutCompleto = document.getElementById("rut").value;
  const resultado = document.getElementById("resultado");
  const inputDV = document.getElementById("digitoVerificador");

  // Mostrar estado de carga
  resultado.textContent = "⏳ Validando...";
  resultado.className = "text-info fw-bold";
  inputDV.value = "";

  try {
    // Llamar a la API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rut: rutCompleto })
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }

    const data = await response.json();

    // Mostrar el dígito verificador en el input
    inputDV.value = data.digitoVerificador;

    // Mostrar resultado
    if (data.valido) {
      resultado.textContent = data.mensaje;
      resultado.className = "text-success fw-bold";
    } else {
      resultado.textContent = data.mensaje;
      resultado.className = "text-danger fw-bold";
    }

  } catch (error) {
    resultado.textContent = "❌ Error al conectar con la API. Asegúrate de que el servidor esté corriendo en http://localhost:3000";
    resultado.className = "text-danger fw-bold";
    console.error('Error:', error);
  }
});