# 🚀 Web dev 101

fundamentos de HTML y CSS para construir una página web estatica

Wrapping up

[ppt 000](https://docs.google.com/presentation/d/1VJrrIMBsB1giJoi9T9MKJtqOK27cYpb_/edit?usp=drive_link&ouid=105880196810779486974&rtpof=true&sd=true)

[ppt 001](https://docs.google.com/presentation/d/1n_PZq4BYIzY7m8sAe8Cn7tBYWpgPGDBR/edit?usp=drive_link&ouid=105880196810779486974&rtpof=true&sd=true)


Drive

https://drive.google.com/drive/u/0/folders/13zGTKvT2J8ZY7ocLoyBuqH5E7TjB1t5n
---

# 🌐 HTML: El Esqueleto de la Web

HTML (HyperText Markup Language) es el lenguaje que estructura el contenido de una página web. Es como el esqueleto del cuerpo humano.

-   **`<!DOCTYPE html>`**: Define el tipo de documento.
-   **`<html>`**: El elemento raíz que envuelve toda la página.
-   **`<head>`**: Contiene metadatos (información sobre la página) que no se muestran.
    -   **`<title>`**: El título que aparece en la pestaña del navegador.
    -   **`<meta>`**: Metadatos adicionales (ej: `charset="UTF-8"` para caracteres especiales).
    -   **`<link>`**: Vincula archivos externos, como hojas de estilo CSS.
-   **`<body>`**: Contiene todo el contenido visible de la página.

---

# 🧱 Tags HTML Comunes

Aquí están los bloques de construcción más importantes que usarás:

-   **Encabezados**:
    -   `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
-   **Párrafos**:
    -   `<p>`
-   **Listas**:
    -   Listas ordenadas: `<ol>`, con ítems `<li>`
    -   Listas desordenadas: `<ul>`, con ítems `<li>`
-   **Imágenes**:
    -   `<img src="ruta/a/imagen.jpg" alt="Descripción de la imagen">`
-   **Enlaces**:
    -   `<a href="https://www.ejemplo.com">Texto del enlace</a>`
-   **Divisores**:
    -   `<div>`, `<section>`, `<article>` (para organizar el contenido)
-   **Elementos de Formato de Texto**:
    -   `<strong>` (negrita importante), `<em>` (énfasis, cursiva)
    -   `<br>` (salto de línea), `<hr>` (línea horizontal)

---

# 🎨 CSS: estilo

CSS (Cascading Style Sheets) es el lenguaje que le da estilo a la página web, como colores, fuentes, tamaños y diseño. Es la ropa y el maquillaje de tu esqueleto.

---

# ✍️ Escribiendo Reglas CSS

Una regla CSS tiene tres partes:

**Selector** { **Propiedad**: **Valor**; }

-   **Selector**: Elige los elementos HTML a los que aplicarás el estilo.
-   **Propiedad**: La característica que quieres cambiar (ej: `color`, `font-size`).
-   **Valor**: El valor que quieres darle a la propiedad (ej: `blue`, `16px`).

**Ejemplo**:

```css
h1 {
  color: #333;
  text-align: center;
}
```

# Conectando HTML y CSS
Existen tres formas de aplicar CSS:

En línea (Inline CSS): Directo en el tag HTML.
```
<h1 style="color: red;">¡Hola!</h1>
```
(No recomendado para proyectos grandes)

Hoja de estilo interna (Internal CSS): Dentro de la etiqueta `<style>` en el `<head>` .
```
<head><style>p { color: blue; }</style></head>
````

Hoja de estilo externa (External CSS): La más común y recomendada.

Crea un archivo .css (ej: styles.css).

Vincúlalo en el <head> de tu HTML:
```
<link rel="stylesheet" href="styles.css">
```

# Selectores CSS Comunes

Aprende a seleccionar elementos para aplicarles estilos:

Selector de elemento: `p { ... }` (selecciona todos los párrafos).

Selector de clase: `.mi-clase { ... }` (selecciona elementos con class="mi-clase").

Selector de ID: `#mi-id { ... }` (selecciona un elemento con id="mi-id", único por página).

Selector de descendiente: `ul li { ... }` (selecciona los `<li>`  dentro de un `<ul>`).

Selector universal: `* { ... }` (selecciona todos los elementos).

# 📐 Propiedades CSS Esenciales
Cajas (Box Model):

`width`, `height` 

`margin` (espacio exterior), `padding`(espacio interior)

`border` (borde de la caja)

Tipografía:

`font-family`, `font-size`, `font-weight`

`color`, `text-alignv`

Colores y Fondo:

`background-color`, `background-image`

Flexbox y Grid:

`display: flex;`: en CSS convierte un elemento en un contenedor flexible (flex container), lo que te permite alinear y distribuir sus elementos secundarios (llamados ítems flexibles o flex items) a lo largo de un solo eje. Este sistema de diseño es ideal para crear componentes de una dimensión, como barras de navegación, formularios o tarjetas, ya que te da un control preciso sobre cómo los ítems se distribuyen y ajustan al espacio disponible.

`display: grid;`:  en CSS convierte un elemento en un contenedor de cuadrícula, lo que te permite organizar sus elementos secundarios (llamados ítems de cuadrícula) en filas y columnas. Es el primer paso para usar el sistema de diseño CSS Grid Layout.
Dentro del main:

`header`
`main` 
`footer`


# index.html y styles.css.

## index.html

HTML
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Primera Página Web</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Mi Blog Personal</h1>
  </header>
  <nav>
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Acerca de</a></li>
      <li><a href="#">Contacto</a></li>
    </ul>
  </nav>
  <main>
    <section class="post-destacado">
      <h2>Mi Primer Post</h2>
      <p>¡Hola mundo! Esta es mi primera publicación en el blog.</p>
    </section>
  </main>
  <footer>
    <p>&copy; 2025 Mi Página. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
```

# ✍️ Estilizando con CSS
styles.css

## CSS
```css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  color: #333;
  margin: 0;
  line-height: 1.6;
}

header {
  background-color: #5cb85c;
  color: white;
  padding: 1rem 0;
  text-align: center;
}

nav ul {
  list-style: none;
  background-color: #444;
  padding: 0;
  margin: 0;
  text-align: center;
}

nav li {
  display: inline-block;
}

nav a {
  display: block;
  color: white;
  padding: 14px 20px;
  text-decoration: none;
}

main {
  padding: 2rem;
}

.post-destacado {
  background-color: white;
  border-left: 5px solid #5cb85c;
  padding: 1rem;
}

footer {
  text-align: center;
  padding: 1rem 0;
  background-color: #333;
  color: white;
  position: fixed;
  width: 100%;
  bottom: 0;
}
```

# Algunos videos interesantes

https://www.youtube.com/watch?v=HGTJBPNC-Gw

ESTE es el CSS + HTML:

https://www.youtube.com/watch?v=G3e-cpL7ofc

https://www.youtube.com/watch?v=ELSm-G201Ls

input types:

https://www.w3schools.com/html/html_form_input_types.asp

Stanford course:

https://www.youtube.com/watch?v=Ps8jOj7diA0&list=PL9D558D49CA734A02

------------
# test00

```html
<!DOCTYPE html>
<html>
<head>
    <title>Desafío de Corrección</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>

    <h1 class="header_principal">Desarrollo Web</h1>

    <p id="#descripcion-pagina">Aprende a crear sitios web increíbles.</p>

    <button class="button-principal">Saber más</button>

</body>
</html>
```

```css
/*
 * Hoja de estilos con errores
 */

.header_principal{
    color: blue;
}

#descripcion-pagina{
    color: grey;
}

boton-principal{
    border: 1px solid red;
}
```

### solucion
- id con `#` al principio
- boton principal 

# test01

crear un formulario de contacto utilizando HTML y CSS. El formulario debe cumplir con los siguientes requisitos:

Un título principal que diga "Formulario de contacto".

Dos campos de entrada de texto: uno para el Nombre y otro para el Email.

Un área de texto (textarea) para que el usuario escriba un Mensaje.

Un botón de envío con el texto "Enviar Mensaje".

Utiliza CSS para dar un estilo minimalista al formulario. El fondo de los campos de entrada y el área de texto debe ser de un color claro, el texto debe ser legible, y el botón debe tener un color de fondo diferente al de los campos de entrada para destacarse.


```html
<form action="#" method="post" class="formulario-contacto">
    <h2>Formulario de contacto</h2>

    <div class="campo">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" required>
    </div>

    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="campo">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="5" required></textarea>
    </div>

    <button type="submit" class="boton-enviar">Enviar Mensaje</button>
</form>
```

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
}

.formulario-contacto {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.formulario-contacto h2 {
    text-align: center;
    color: #333;
}

.campo {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.campo label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.campo input,
.campo textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fafafa;
}

.campo input:focus,
.campo textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.boton-enviar {
    padding: 12px 20px;
    background-color: light-blue;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.boton-enviar:hover {
    background-color: #0056b3;
}
```

# test02 ******* tomar con cautela ********

```html
<!DOCTYPE html>
<html>
<head>
    <title>Página de perfil</title>
</head>
<body>

    <div id="header">
        <h1>Perfil de Usuario</h1>
    </div>

    <div class="contenido">
        <p>
            <div class="user-info">
                <span>Nombre: Juan Pérez</span>
                <span>Email: juan.perez@email.com</span>
            </div>
        </p>
        <p>
            <h3>Sobre mí</h3>
            <span class="bio-text">Soy un desarrollador web junior con 2 años de experiencia. Me encanta aprender nuevas tecnologías.</span>
        </p>
    </div>

    <div id="footer">
        © 2023 Mi Sitio Web
    </div>

</body>
</html>
```

```css
#header {
    background: gray;
    color: black;
    text-align: middle;
}

.contenido p {
    font-size: 14px;
    margin-top: 10px;
}

.user-info {
    font-weight: bold;
    display: block;
}

#footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    width: 100%;
}
```

## solve
### html 

HTML semántico: Las etiquetas `<div>` se han reemplazado por etiquetas semánticas como `<header>`, `<main>` y `<footer>`.

Anidamiento incorrecto: El div con la clase user-info estaba anidado dentro de una etiqueta `<p>`, lo cual es incorrecto. Se corrigió su posición.

Uso de etiquetas: La etiqueta `<span>` con la clase bio-text se cambió por `<p>` para un mejor flujo de texto. El encabezado `<h3>` ahora usa la etiqueta `<h2>` ya que el `<h1>` está en el encabezado principal, siguiendo una jerarquía lógica.

Información de contacto: Para la información del usuario, es más apropiado usar una lista desordenada `<ul>` con elementos de lista `<li>` para una mejor estructura.


### css

text-align: Se cambió middle a center para alinear el texto horizontalmente.

Selectores: Se ajustaron los selectores para que coincidan con la nueva estructura HTML (header en lugar de #header, etc.).

Posición del footer: position: absolute; puede causar problemas con el diseño de la página si el contenido es largo. Una mejor práctica es position: relative; o usar Flexbox/Grid para que el pie de página se mantenga al final del contenido.

# test03

Diseña un formulario de contacto simple utilizando HTML y CSS. El formulario debe incluir los siguientes campos:

Nombre (campo de texto)

Correo electrónico (campo de correo electrónico)

Mensaje (área de texto)

El formulario debe tener un botón de envío. Además, aplica los siguientes estilos con CSS:

Un ancho máximo para el formulario.

Un padding interno para separar el contenido de los bordes.

Un borde y una sombra para darle un aspecto de tarjeta.

Asegúrate de que los campos de entrada y el botón tengan estilos coherentes (mismo tamaño, bordes redondeados, etc.).

Los labels deben estar por encima de los campos de entrada.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Formulario de Contacto</title>
    <link rel="stylesheet" href="form-styles.css">
</head>
<body>

    <div class="form-container">
        <h2>Contáctanos</h2>
        <form action="#" method="post">
            <div class="form-group">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="mensaje">Mensaje:</label>
                <textarea id="mensaje" name="mensaje" rows="4" required></textarea>
            </div>
            
            <button type="submit">Enviar Mensaje</button>
        </form>
    </div>
</body>
</html>
```

```css
body {
    background-color: #f4f4f4;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
}

.form-container {
    background-color: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
}

.form-container h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box; /* Para que el padding no afecte el ancho */
    font-size: 16px;
}

.form-group textarea {
    resize: vertical;
}

button[type="submit"] {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
    background-color: #0056b3;
}
```

# test04
```html
<html-file>
  <cabeza>
    <title>Ejercicio de CSS</title>
    <link rel="stylesheet" href="style.css>
  </cabeza>
  <body>
    <h1><titulo>Mi primer sitio web</titulo></h1>
    <p class="parrafo_principal">
      Este es un párrafo de ejemplo para probar las reglas de estilo.
    </p>
  </body>
</html-file>
```

```css
.titulo-principal {
  color: rojo;
}

div .parrafo_principal {
  background-color: yellow;
}

#contenedor {
  border: 2px solid blue;
}
```

## solve
- cierre de comillas
- etiquetas incorrectas


# test05
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <style>
        .my-card {
            background-color: #f8f9fa;
            border: 1px solid #ccc;
            padding: 10px;
        }
        .card-title {
            color: blue;
            font-size: 24px;
        }
    </style>
</head>
<body>

<div class="my-card">
    <image src="https://via.placeholder.com/150" alt="Placeholder">
    <div class="card-title">
        Mi título de Tarjeta
    </div>
    <p>
        Este es un texto de ejemplo para la tarjeta.
    </p>
</div>

</body>
</html>

Tag incorrecto: La etiqueta para la imagen debe ser <img>, no <image>.

Clases de Bootstrap faltantes: El div contenedor necesita la clase card. El div del título necesita la clase card-body para el relleno y, dentro de este, el título necesita la clase card-title. La imagen debería tener la clase card-img-top si se coloca arriba del cuerpo.

Clases CSS redundantes: Las clases CSS personalizadas como .my-card y .card-title no son necesarias si se usan las clases de Bootstrap. La sintaxis del link para Bootstrap es correcta, por lo que podemos confiar en esas clases.


# test06

Tu tarea es crear un formulario de contacto con las siguientes especificaciones:

Debe tener campos para el nombre, el email y un área de texto para el mensaje.

Cada campo debe tener una etiqueta (<label>) asociada y un placeholder que indique qué información se debe ingresar.

El formulario debe incluir un botón para enviar.

Utiliza HTML semántico para la estructura del formulario (<form>, <input>, <textarea>, <button>).

Aplica estilos CSS para que el formulario sea estéticamente agradable. Sugiero un ancho fijo, un fondo de color suave, bordes redondeados y un padding generoso.

<br>

```

<form action="#" method="post" class="contact-form">
    <h2>Formulario de Contacto</h2>
    <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" name="name" placeholder="Tu nombre completo" required>
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" placeholder="tu.email@ejemplo.com" required>
    </div>
    <div class="form-group">
        <label for="message">Mensaje:</label>
        <textarea id="message" name="message" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
    </div>
    <button type="submit">Enviar Mensaje</button>
</form>
```

```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.contact-form {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    box-sizing: border-box;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #555;
}

input[type="text"],
input[type="email"],
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 16px;
}

input[type="text"]:focus,
input[type="email"]:focus,
textarea:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

textarea {
    resize: vertical;
}

button {
    width: 100%;
    padding: 15px;
    border: none;
    background-color: #007bff;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #0056b3;
}
```

------------
# Tarea

- Generar un formulario, que contenga un input texto que valide el formato del rut.
(generar un `pattern`)

- Use un placeholder para mostrar al usuario que formato debe ingresar
