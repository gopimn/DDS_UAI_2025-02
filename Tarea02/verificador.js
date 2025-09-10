function calcularDigitoVerificador(rut) {

    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    let numeros = rut.slice(0, -1);
    let dvIngresado = rut.slice(-1).toUpperCase();

    let numerosInvertidos = numeros.split('').reverse();
    let serie = [2, 3, 4, 5, 6, 7];

    let suma = 0;
    for (let i = 0; i < numerosInvertidos.length; i++) {
        suma += parseInt(numerosInvertidos[i]) * serie[i % serie.length];
    }

    let resto = suma % 11;
    let digito = 11 - resto;

    if (digito === 11) digito = '0';
    else if (digito === 10) digito = 'K';
    else digito = digito.toString();

    return digito === dvIngresado;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const rutInput = document.querySelector("#rut");

    form.addEventListener("submit", function(e) {
        if (!calcularDigitoVerificador(rutInput.value)) {
            e.preventDefault();
            rutInput.classList.add("is-invalid");
            rutInput.classList.remove("is-valid");
        } else {
            rutInput.classList.remove("is-invalid");
            rutInput.classList.add("is-valid");
        }
    });
});
