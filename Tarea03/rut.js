function calculateVerifierDigit(rutNumbers) {
    let sum = 0;
    let multiplier = 2;
    
    // Esto es para el cálculo del dígito verificador, multiplicando los valores por 2,3,4,5,6,7 (y después vuelve a 2). Después suma todo, lo divide en 11 y el sobrante es el número que se busca.
    for (let i = rutNumbers.length - 1; i >= 0; i--) {
        sum += parseInt(rutNumbers[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;
    const verifierDigit = 11 - remainder;

    if (verifierDigit === 11) return '0';
    if (verifierDigit === 10) return 'K';
    return verifierDigit.toString();
}

document.getElementById('rutForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const rutInput = document.getElementById('rutInput').value;
    const cleanRut = rutInput.replace(/\./g, '').replace('-', '');
    const numbers = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();
    const calculatedVerifier = calculateVerifierDigit(numbers);
    const resultDiv = document.getElementById('rutResult');
    if (calculatedVerifier === verifier) {
        resultDiv.innerHTML = '<div class="alert alert-success">RUT válido</div>';
    } else {
        resultDiv.innerHTML = '<div class="alert alert-danger">RUT inválido</div>';
    }
});

// ESTO ES ÉPICO PORQUE ACTUALIZA EL FORMATO EN TIEMPO REAL
document.getElementById('rutInput').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\./g, '').replace('-', '');
    value = value.replace(/[^0-9kK]/g, '');
    
    if (value.length > 1) {
        value = value.slice(0, value.length - 1) + '-' + value.slice(value.length - 1);
    }
    if (value.length > 4) {
        const parts = value.split('-');
        const numbers = parts[0];
        const formatted = numbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        value = formatted + (parts[1] ? '-' + parts[1] : '');
    }
    
    e.target.value = value;
});