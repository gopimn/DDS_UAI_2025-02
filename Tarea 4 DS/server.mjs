import { createServer } from 'node:http';

function calcularDV(rutSinDV) {
    rutSinDV = rutSinDV.replace(/[^\d]/g, '');
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

const server = createServer((req, res) => {
    // Agrega headers CORS para todas las respuestas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Maneja preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/dv') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const { rut } = JSON.parse(body);
            const dv = calcularDV(rut);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ dv }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});