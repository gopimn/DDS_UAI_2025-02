# ⛳ GolfSocial - Red Social para Golfistas

Una aplicación web moderna donde golfistas pueden compartir sus tarjetas de golf, calcular su handicap automáticamente y conectar con amigos.

## 🚀 Características Principales

- **Autenticación Segura**: Registro e inicio de sesión con contraseñas hasheadas (bcrypt)
- **Red Social**: Agregar amigos, descubrir jugadores, ver scorecards de amigos
- **Cálculo de Handicap**: Cálculo automático de handicap basado en últimas 20 rondas
- **Tarjetas de Golf**: Cargar scorecards con fecha, campo, golpes y par
- **Tema Oscuro/Claro**: Soporte para modo oscuro con preferencia del sistema
- **Multiidioma**: Interfaz en Español e Inglés (i18n)
- **Seguridad**: Validación de permisos, JWT tokens, CORS habilitado

## 📋 Requisitos Previos

- **Node.js** v18+
- **npm** 9+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## ⚙️ Instalación

### 1. Clonar/Descargar el Proyecto

```bash
cd Proyecto
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Instalar Dependencias del Frontend

El frontend usa React vía CDN, **no requiere instalación de paquetes**.

## 🔧 Configuración

### Backend (`.env` - Opcional)

Crea un archivo `backend/.env` si quieres usar OpenAI para cálculo de handicap:

```env
JWT_SECRET=tu-clave-secreta-super-segura
OPENAI_API_KEY=tu-api-key-opcional
PORT=4000
```

**Nota**: Si no configuras OPENAI_API_KEY, el sistema usa un cálculo heurístico local.

## 🎯 Iniciar la Aplicación

### Terminal 1 - Backend (Puerto 4000)

```bash
cd backend
npm start

# O con nodemon (desarrollo):
npm run dev
```

**Salida esperada:**
```
Backend running on http://localhost:4000
```

### Terminal 2 - Frontend (Puerto 3000)

```bash
cd frontend
npx http-server -p 3000
```

**Salida esperada:**
```
Starting up http-server, serving .
http://localhost:3000
```

### 3. Abrir en Navegador

```
http://localhost:3000
```

## 🎮 Cómo Usar

### 1. Registro

- Ingresa un email y contraseña
- Haz clic en "Register"
- Se guarda un token JWT en localStorage

### 2. Crear Tarjeta de Golf

- Ve a la pestaña "Feed"
- Completa:
  - Fecha
  - Campo (nombre del campo de golf)
  - Golpes (total de golpes)
  - Par (par del campo)
- Haz clic en "Save"
- Se calcula tu handicap automáticamente

### 3. Agregar Amigos

- Ve a "Discover Players" (lupa 🔍)
- Busca por email
- Haz clic en "Add Friend"
- Verás el handicap del amigo

### 4. Ver Feed de Amigos

- Ve a "Feed"
- Ves tus tarjetas + tarjetas de amigos
- Puedes eliminar tus propias tarjetas

### 5. Cambiar Idioma/Tema

- Botón en header: EN/ES para idioma
- Botón sol/luna para tema oscuro

## 📁 Estructura del Proyecto

```
Proyecto/
├── frontend/
│   ├── index.html          # Punto de entrada HTML
│   ├── app.js              # Componente React principal (con hooks)
│   ├── styles.css          # Estilos con variables de tema
│   ├── en.json             # Traducciones en inglés
│   └── es.json             # Traducciones en español
│
├── backend/
│   ├── server.js           # Servidor Express con todas las rutas
│   ├── package.json        # Dependencias
│   ├── .env                # Configuración (opcional)
│   ├── data/
│   │   ├── users.json      # Base de datos de usuarios
│   │   └── items.json      # Base de datos de tarjetas
│   └── README.md           # Documentación backend
│
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### Autenticación

```
POST /api/auth/register
  Body: { email, password }
  Response: { token, user: { email, handicap, friends } }

POST /api/auth/login
  Body: { email, password }
  Response: { token, user: { email, handicap, friends } }
```

### Usuarios

```
GET /api/user/:id
  Response: { email, handicap, cardCount }

GET /api/user/me
  Headers: Authorization: Bearer <token>
  Response: { email, handicap, friends: [...] }

GET /api/users/search?q=email
  Response: [ { id, email, handicap }, ... ]
```

### Tarjetas (Scorecards)

```
GET /api/items
  Headers: Authorization: Bearer <token>
  Response: [{ id, date, course, strokes, par, owner, handicapDiff }]
  Filtro: public || propias || de amigos

GET /api/items/public
  Response: [{ id, date, course, strokes, par, owner, handicapDiff }]

POST /api/items
  Headers: Authorization: Bearer <token>
  Body: { date, course, strokes, par }
  Response: { id, ... } + actualiza handicap del usuario

PUT /api/items/:id
  Headers: Authorization: Bearer <token>
  Body: { date, course, strokes, par }
  Response: { id, ... }
  Error: 403 si no eres el owner

DELETE /api/items/:id
  Headers: Authorization: Bearer <token>
  Error: 403 si no eres el owner
```

### Amigos

```
GET /api/friends
  Headers: Authorization: Bearer <token>
  Response: [ { id, email, handicap }, ... ]

POST /api/friends/add
  Headers: Authorization: Bearer <token>
  Body: { friendId }
  Response: { success: true }

DELETE /api/friends/:friendId
  Headers: Authorization: Bearer <token>
```

### IA (Handicap Calculation)

```
POST /api/ai/handicap
  Headers: Authorization: Bearer <token>
  Body: { strokes, par }
  Response: { handicapDiff: number, explanation: string }
```

## 🔐 Autenticación

- Contraseñas hasheadas con **bcryptjs** (10 rounds)
- JWT tokens válidos por **7 días**
- Los tokens se guardan en `localStorage`
- Cada petición protegida incluye: `Authorization: Bearer <token>`
- El backend valida el token en cada endpoint protegido

## 🧮 Cálculo de Handicap

El sistema calcula el handicap de dos formas:

### 1. **Por Tarjeta Individual**
```
Handicap Differential = (Strokes - Par) * 113 / Course Rating
```

### 2. **Handicap General del Usuario**
```
Se toman las últimas 20 rondas
Se promedian los diferenciales
Se aplica ponderación por cantidad de rondas
```

Si tienes OpenAI API configurado, se usa GPT-3.5-turbo; si no, se usa la fórmula local.

## 🎨 Tema y Estilos

El frontend usa **CSS Variables** para theming:

### Variables disponibles (en styles.css):
```css
--bg              /* Background principal */
--surface         /* Superficie de cards */
--text            /* Color de texto */
--accent          /* Color primario (azul) */
--border          /* Color de bordes */
--success         /* Verde para éxito */
--warning         /* Naranja para advertencia */
--danger          /* Rojo para error */
```

### Modo Automático
- Detecta preferencia del sistema (`prefers-color-scheme`)
- Se guarda en `localStorage['theme']`
- Hay botón para toggle manual

## 🌍 Idiomas

El sistema carga automáticamente traducciones de:
- `frontend/en.json`
- `frontend/es.json`

Las claves se usan así:
```javascript
const { t } = useTranslations();
t('email')  // "Email" (en) o "Correo" (es)
```

## 📊 Persistencia de Datos

- **Frontend**: localStorage (token, tema, idioma, fallback de datos)
- **Backend**: Archivos JSON (`data/users.json`, `data/items.json`)
  - ⚠️ **Nota**: Para producción, usa una base de datos real (PostgreSQL, MongoDB, etc.)

## 🚨 Limitaciones Actuales

1. **Base de datos en archivos** - No escala en producción
2. **SSO no implementado** - Solo email/password
3. **Sin validación de email** - Puedes registrar emails falsos
4. **Sin rate limiting** - Sin protección contra spam
5. **Handicap heurístico** - Simplificado, no es el estándar USGA real

## 🔮 Mejoras Futuras

- [ ] Conectar PostgreSQL/MongoDB para persistencia real
- [ ] Implementar Google OAuth / SSO
- [ ] Validar emails con OTP
- [ ] Rate limiting con Redis
- [ ] Implementar handicap USGA completo
- [ ] Agregar tests (Jest, React Testing Library)
- [ ] Deploy a Vercel/Heroku
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Gamificación (badges, leaderboards)

## 🐛 Troubleshooting

### Error: "Port 4000 already in use"
```bash
# Windows: Encuentra y mata el proceso
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4000 | xargs kill -9
```

### Error: "CORS policy"
- Asegúrate que el backend está corriendo en puerto 4000
- Verifica que tienes `CORS` habilitado en `backend/server.js`

### Las traducciones no aparecen
- Verifica que `frontend/en.json` y `frontend/es.json` existen
- Abre DevTools Console y busca errores de fetch

### JWT expired
- Los tokens expiran en 7 días
- El usuario debe volver a hacer login
- El token expirado se borra de localStorage automáticamente

## 📝 Ejemplo de Uso Rápido

```bash
# Terminal 1
cd backend
npm install
npm start

# Terminal 2
cd frontend
npx http-server -p 3000

# Navegador: http://localhost:3000

# Acciones:
# 1. Register: test@example.com / password123
# 2. Add scorecard: 2024-12-15, "Punta del Este", 85, 72
# 3. Repeat para agregar más tarjetas
# 4. Ver cálculo de handicap automático
# 5. Buscar y agregar amigos
# 6. Ver sus scorecards en el feed
```

## 📄 Licencia

Proyecto educativo - Curso DDS UAI 2025

## 👨‍💻 Autor

Desarrollado como ejercicio de desarrollo web full-stack.

---

**¡Disfruta comparando handicaps con tus amigos! ⛳**
