document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();
    const rut = document.getElementById('rut').value;
    
    // Hacer la solicitud a la API
    fetch('http://localhost:3000/api/validar-rut', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rut: rut })
    })
    .then(response => response.json())
    .then(data => {
        const digitoInput = document.getElementById('digito');
        if (data.valido) {
            digitoInput.value = data.digito;
        } else {
            alert('El RUT es inválido.');
        }
    })
    .catch(error => console.error('Error:', error));
});
