const form = document.getElementById("rutForm");
const inputRut = document.getElementById("rut");
const inputDV = document.getElementById("dv");
const inputRutCompleto = document.getElementById("rutCompleto");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const rut = inputRut.value.trim().replace(/\D/g, "");
  if (!rut) {
    resultado.textContent = "Ingrese un RUT válido.";
    resultado.className = "error";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/calcular-dv?rut=${rut}");
    if (!response.ok) throw new Error("Error en la API");

    const data = await response.json();

    inputDV.value = data.dv;
    inputRutCompleto.value = data.rutCompleto;

    resultado.textContent = "Dígito verificador calculado: ${data.dv}";
    resultado.className = "success";
  } catch (err) {
    resultado.textContent = "Error: ${err.message}";
    resultado.className = "error";
  }
});
