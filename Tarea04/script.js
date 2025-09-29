
function apiCalcularDV(rutSinDV) {
  let rut = rutSinDV.replace(/\./g, '').replace(/-/g, '');
  let suma = 0;
  let multiplo = 2;
  for (let i = rut.length - 1; i >= 0; i--) {
    suma += parseInt(rut.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  let dv = 11 - (suma % 11);
  if (dv === 11) return '0';
  if (dv === 10) return 'K';
  return dv.toString();
}


document.getElementById('rut').addEventListener('input', function() {
  const rutInput = this.value;
  const dvInput = document.getElementById('dv');
  if (/^\d{1,2}\.\d{3}\.\d{3}$/.test(rutInput)) {
    dvInput.value = apiCalcularDV(rutInput);
  } else {
    dvInput.value = '';
  }
});


document.getElementById('rutForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const rutInput = document.getElementById('rut').value;
  const dvInput = document.getElementById('dv').value;
  const resultado = document.getElementById('resultado');
  if (!/^\d{1,2}\.\d{3}\.\d{3}$/.test(rutInput)) {
    resultado.textContent = "Formato incorrecto. Ejemplo: 12.345.678";
    resultado.className = "alert alert-danger";
    return;
  }
  if (!dvInput) {
    resultado.textContent = "No se pudo calcular el dígito verificador.";
    resultado.className = "alert alert-danger";
    return;
  }
  resultado.textContent = `El dígito verificador calculado es: ${dvInput}`;
  resultado.className = "alert alert-success";
});