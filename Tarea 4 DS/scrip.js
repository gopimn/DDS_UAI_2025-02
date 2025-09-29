document.addEventListener('DOMContentLoaded', function() {
    // Para web2.html
    const form = document.querySelector('form');
    const rutInput = document.getElementById('Rut');
    const dvOutput = document.getElementById('dv-output');

    if (form && rutInput && dvOutput) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const rutValue = rutInput.value;

            fetch('http://127.0.0.1:3000/api/dv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rut: rutValue })
            })
            .then(response => response.json())
            .then(data => {
                dvOutput.textContent = 'El dígito verificador es: ' + data.dv;
                localStorage.setItem('dv', data.dv);
                window.location.href = 'web3.html';
            })
            .catch(err => {
                dvOutput.textContent = 'Error al obtener dígito';
            });
        });
    }

    // Para web3.html
    const dvOutputWeb3 = document.getElementById('dv-output');
    if (dvOutputWeb3 && !form) {
        const dv = localStorage.getItem('dv');
        if (dv) {
            dvOutputWeb3.textContent = 'El dígito verificador de tu RUT es: ' + dv;
        }
    }
});

