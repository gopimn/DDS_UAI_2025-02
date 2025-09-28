// Validar el rut, se revisara que el RUT este bien escrito y si el digito verificado es correcto
// espera a que la apgina este lista
document.addEventListener('DOMContentLoaded', function() {
  const rutInput = document.getElementById('rut'); //revisamos si el input id=rut existe
  if (!rutInput) return; //si no existe nos regresamos
//mensaje de error
  let errorSpan = document.createElement('span'); 
  errorSpan.id = 'rut-error'; 
  errorSpan.style.color = '#e6007a'; //texto rosa ->span
  errorSpan.style.display = 'none'; //al comienzo esta oculto
  rutInput.parentNode.appendChild(errorSpan);



  async function llamarApiRutDigitoVerificador(rutSinDigito){

    const url = "http://localhost:3000/rut";
    const respuesta = await (await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ RUT: rutSinDigito })
    })).json();
    const digitoVerificador = respuesta.digitoVerificador;
    return digitoVerificador;

  }
//blur es cualdo el usuario sale del campo
  rutInput.addEventListener('blur', async function() {
    const rutValue = this.value.replace(/\./g, '').replace('-', '');
    if (rutValue.length < 2) return;
    const cuerpo = rutValue.slice(0, -1);
    const dvIngresado = rutValue.slice(-1).toUpperCase();
    const dvCalculado = await llamarApiRutDigitoVerificador(cuerpo);
    if (dvIngresado !== dvCalculado) { //compara y muestra error
      errorSpan.textContent = 'RUT inválido';
      errorSpan.style.display = 'inline';
    } else {
      errorSpan.style.display = 'none';
    }
  });
});