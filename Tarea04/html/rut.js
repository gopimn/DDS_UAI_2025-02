function calculateVerifierDigit(rutNumbers) {
    let sum = 0;
    let multiplier = 2;
    
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

// Formulario de validación
document.getElementById('rutFormValidate').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rutInput = document.getElementById('rutInputValidate').value;
    const cleanRut = rutInput.replace(/\./g, '').replace('-', '');
    const numbers = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1).toUpperCase();
    
    const calculatedVerifier = calculateVerifierDigit(numbers);
    const resultDiv = document.getElementById('rutResultValidate');
    
    if (calculatedVerifier === verifier) {
        resultDiv.innerHTML = '<div class="alert alert-success">RUT válido</div>';
    } else {
        resultDiv.innerHTML = '<div class="alert alert-danger">RUT inválido</div>';
    }
});

// Formulario de cálculo
document.getElementById('rutFormCalculate').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const rutInput = document.getElementById('rutInputCalculate').value;
    const digitoVerificador = document.getElementById('digitoVerificador');
    const resultDiv = document.getElementById('rutResultCalculate');

    try {
        const response = await fetch('http://localhost:3000/api/digito-verificador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rut: rutInput })
        });

        if (!response.ok) {
            throw new Error('Error en la llamada a la API');
        }

        const data = await response.json();
        digitoVerificador.value = data.digito;
        resultDiv.innerHTML = '<div class="alert alert-success">Dígito verificador calculado correctamente</div>';
    } catch (error) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Error al calcular el dígito verificador</div>';
        console.error('Error:', error);
    }
});

// Formateo en tiempo real para ambos inputs
['rutInputValidate', 'rutInputCalculate'].forEach(inputId => {
    document.getElementById(inputId).addEventListener('input', function(e) {
        let value = e.target.value.replace(/\./g, '').replace('-', '');
        value = value.replace(/[^0-9kK]/g, '');
        
        if (inputId === 'rutInputValidate' && value.length > 1) {
            value = value.slice(0, -1) + '-' + value.slice(-1);
        }
        
        if (value.length > 3) {
            const parts = value.split('-');
            const numbers = parts[0];
            const formatted = numbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            value = formatted + (parts[1] ? '-' + parts[1] : '');
        }
        
        e.target.value = value;
    });
});