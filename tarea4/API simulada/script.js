// --- API simulada ---
const RutAPI = {
  calcularDV: (numero) => {
    return new Promise((resolve, reject) => {
      if (!/^\d+$/.test(numero)) {
        reject("El cuerpo del RUT debe ser numérico.");
        return;
      }

      let suma = 0, mult = 2;
      for (let i = numero.length - 1; i >= 0; i--) {
        suma += Number(numero[i]) * mult;
        mult = (mult === 7) ? 2 : mult + 1;
      }
      const resto = suma % 11;
      const dv = 11 - resto;

      if (dv === 11) resolve("0");
      else if (dv === 10) resolve("K");
      else resolve(String(dv));
    });
  }
};

// --- UI ---
const form = document.getElementById("rutForm");
const inputRut = document.getElementById("rut");
const inputDV = document.getElementById("dv");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Quitamos puntos y guiones, nos quedamos solo con los dígitos
  const rut = inputRut.value.trim().replace(/\D/g, "");
  if (!rut) {
    resultado.textContent = "Ingrese un RUT válido.";
    resultado.className = "error";
    inputDV.value = "";
    return;
  }

  try {
    const dv = await RutAPI.calcularDV(rut);
    inputDV.value = dv;
    resultado.textContent = `✅ Dígito verificador calculado: ${dv}`;
    resultado.className = "success";
  } catch (err) {
    inputDV.value = "";
    resultado.textContent = `❌ Error: ${err}`;
    resultado.className = "error";
  }
});
