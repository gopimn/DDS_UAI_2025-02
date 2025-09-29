// dvApi.js
function calcularDV_API(numberStr) {
  return new Promise((resolve, reject) => {
    if (!/^[0-9]+$/.test(numberStr)) {
      reject('Número inválido');
      return;
    }
    let suma = 0;
    let multiplicador = 2;
    for (let i = numberStr.length - 1; i >= 0; i--) {
      suma += parseInt(numberStr.charAt(i), 10) * multiplicador;
      multiplicador++;
      if (multiplicador > 7) multiplicador = 2;
    }
    const resto = suma % 11;
    const diff = 11 - resto;
    let dv;
    if (diff === 11) dv = '0';
    else if (diff === 10) dv = 'K';
    else dv = String(diff);
    resolve(dv);
  });
}