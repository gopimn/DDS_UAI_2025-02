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

  //formula matematica para el DV
  function calcularDV(rut) {
    rut = rut.replace(/\D/g, ''); //quitar todo lo que no sea numero
    let suma = 0;
    let multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut.charAt(i)) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    let dv = 11 - (suma % 11); //vemos el resto que es parte del algoritmo modulo 11
    if (dv === 11) return '0';
    if (dv === 10) return 'K';
    return dv.toString();
  }
//blur es cualdo el usuario sale del campo
  rutInput.addEventListener('blur', function() {
    const rutValue = this.value.replace(/\./g, '').replace('-', '');
    if (rutValue.length < 2) return;
    const cuerpo = rutValue.slice(0, -1);
    const dvIngresado = rutValue.slice(-1).toUpperCase();
    const dvCalculado = calcularDV(cuerpo);
    if (dvIngresado !== dvCalculado) { //compara y muestra error
      errorSpan.textContent = 'RUT inválido';
      errorSpan.style.display = 'inline';
    } else {
      errorSpan.style.display = 'none';
    }
  });
});