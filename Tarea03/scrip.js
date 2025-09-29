document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const rutInput = document.getElementById('Rut');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form submission

        // Get RUT value and remove formatting
        let rutValue = rutInput.value.replace(/[^\d]/g, '');

        // Calculate DV
        let dv = calcularDV(rutValue);

        localStorage.setItem('dv', dv);

        window.location.href = 'web3.html';
    });

    function calcularDV(rutSinDV) {
        let suma = 0;
        let multiplicador = 2;

        for (let i = rutSinDV.length - 1; i >= 0; i--) {
            suma += parseInt(rutSinDV.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        let resto = suma % 11;
        let dv = 11 - resto;

        if (dv === 11) return '0';
        if (dv === 10) return 'K';
        return dv.toString();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const dv = localStorage.getItem('dv');
    const dvOutput = document.getElementById('dv-output');
    if (dv && dvOutput) {
        dvOutput.textContent = 'El dígito verificador de tu RUT es: ' + dv;
    }
});