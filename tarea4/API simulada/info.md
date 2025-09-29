La API simulada es un paso intermedio que te permite practicar asincronía y modularidad sin tener que levantar un servidor real.
Es ideal para tareas, prototipos y aprendizaje, y luego puedes reemplazarla fácilmente por una API real cuando lo necesites.

Razones para usar una API simulada

Aprender el flujo asincrónico

En la web, casi todo se hace de forma asíncrona: consultas a un servidor, bases de datos, APIs externas.

Al envolver la lógica en una promesa (Promise), practicas exactamente el mismo flujo (await / then / catch) que usarías con fetch en una API real.

Cumple con la exigencia “llamar a una API”

Si tu tarea pide “usar una API”, puedes simular que existe un servidor sin necesidad de instalar Node.js ni desplegar nada.

El profe o corrector abre tu index.html y ya puede probar cómo el formulario “consume” una API.

Menos complejidad al inicio

No necesitas configurar backend, puertos, CORS, dependencias, etc.

Te concentras en lo esencial: validar el RUT, calcular el dígito, y mostrarlo en pantalla.

Escalabilidad fácil

Si mañana decides montar una API real en Node.js (como ya te mostré), solo cambias la parte de la función:

En vez de llamar RutAPI.calcularDV(), haces fetch("http://...").

El resto del frontend (formulario, inputs, eventos) queda igual.

Buenas prácticas de modularidad

Separar la lógica de negocio (cálculo del DV) en una “API” permite:

Reutilizar la función en otros proyectos.

Mantener el código ordenado (HTML = estructura, CSS = diseño, JS = lógica, API = cálculos/servicios).
