# 🧪 Testing Checklist - GolfSocial

## ✅ Completed Implementation Summary

### Frontend (app.js) - ✅ DONE
- [x] `useTranslations` hook - Carga traducciones de JSON, soporta español/inglés
- [x] `useTheme` hook - Tema oscuro/claro con preferencia del sistema
- [x] `Header` component - Nav con tabs (feed/friends/search), theme toggle, logout
- [x] `AuthPanel` component - Login/Register con email y password
- [x] `App` component - Estado global, renderizado condicional por tab
- [x] JWT en requests - `getToken()` y `headers()` helper functions
- [x] Feed management - loadFeed() con filtrado automático
- [x] Friends system - loadFriends(), searchUsers(), addFriend()
- [x] CRUD Scorecards - saveCard(), deleteCard() con permisos
- [x] UI Notifications - Toast messages para acciones

### Backend (server.js) - ✅ DONE
- [x] POST /api/auth/register - Crea usuario con bcrypt hash
- [x] POST /api/auth/login - Retorna JWT token
- [x] GET /api/user/:id - Perfil público
- [x] GET /api/user/me - Perfil autenticado con amigos
- [x] GET /api/items - Feed filtrado (público/propias/amigos)
- [x] GET /api/items/public - Feed público sin auth
- [x] POST /api/items - Crear scorecard + actualiza handicap
- [x] PUT /api/items/:id - Editar solo si owner
- [x] DELETE /api/items/:id - Eliminar solo si owner
- [x] GET /api/friends - Lista de amigos
- [x] POST /api/friends/add - Agregar amigo
- [x] DELETE /api/friends/:friendId - Eliminar amigo
- [x] GET /api/users/search?q= - Buscar jugadores
- [x] POST /api/ai/handicap - Calcular handicap (OpenAI o heurístico)
- [x] calculateHandicapFromCards() - Agregación real de últimas 20 rondas
- [x] updateUserHandicap() - Se llama tras cada cambio
- [x] Middleware authRequired - Valida JWT en rutas protegidas

### Security - ✅ DONE
- [x] Contraseñas hasheadas con bcrypt (10 rounds)
- [x] JWT tokens de 7 días de validez
- [x] Validación de ownership en PUT/DELETE (403 Forbidden)
- [x] CORS habilitado para localhost:3000
- [x] JWT enviado en header `Authorization: Bearer <token>`

### i18n - ✅ DONE
- [x] en.json - Todas las claves de traducción en inglés
- [x] es.json - Todas las claves de traducción en español
- [x] Selector de idioma en header
- [x] Persistencia en localStorage

### Styling - ✅ DONE
- [x] CSS Variables para theming
- [x] Tema oscuro/claro automático
- [x] Cards con hover effects
- [x] Responsive grid layout
- [x] Toast notifications con animación
- [x] Sticky header con gradiente

### Documentation - ✅ DONE
- [x] README.md completo con instrucciones
- [x] API endpoint documentation
- [x] Troubleshooting section
- [x] Estructura de carpetas documentada
- [x] Ejemplo de uso rápido

---

## 🧪 Manual Testing Steps

### Test 1: Registro e Inicio de Sesión
```
1. Ir a http://localhost:3000
2. Ver AuthPanel con opciones Login/Register
3. Cambiar a "Register"
4. Ingresar: test@golf.com / password123
5. Click "Register"
6. ✓ Debe redirigir al feed
7. ✓ Token guardado en localStorage
8. Logout
9. ✓ Token eliminado
10. Login con mismas credenciales
11. ✓ Debe funcionar
```

### Test 2: Crear Scorecards
```
1. En pestaña "Feed"
2. Completar formulario:
   - Fecha: 2024-12-15
   - Campo: Punta del Este
   - Golpes: 85
   - Par: 72
3. Click "Save"
4. ✓ Card aparece en feed
5. ✓ Se elimina el formulario
6. ✓ Handicap calculado automáticamente
```

### Test 3: Permisos de Eliminación
```
1. Crear dos usuarios (user1@test.com, user2@test.com)
2. User1: Crear scorecard
3. User2: Intentar eliminar scorecard de user1
4. ✓ Error 403 Forbidden (o no aparece botón delete)
5. User1: Puede eliminar su propia scorecard
6. ✓ Desaparece del feed
```

### Test 4: Sistema de Amigos
```
1. Registro: alice@golf.com / pass123
2. Crear 2 scorecards como Alice
3. Registro: bob@golf.com / pass123
4. Ir a "Discover Players"
5. Buscar "alice"
6. ✓ Aparece Alice con su handicap
7. Click "Add Friend"
8. ✓ Mensaje "Friend added!"
9. Ir a "Feed"
10. ✓ Ver scorecards de Alice en feed
11. Ir a "Friends"
12. ✓ Ver Alice en lista con handicap
```

### Test 5: Cálculo de Handicap
```
1. Crear 5+ scorecards con diferentes resultados
2. ✓ Cada card muestra: Strokes, Par, diferencia
3. ✓ Handicap del usuario actualizado
4. Verificar que handicap es promedio ponderado
5. ✓ Se refleja en perfil público
```

### Test 6: Idioma
```
1. Hacer click selector idioma en header
2. Cambiar a English
3. ✓ Toda interfaz cambia a inglés
4. ✓ Almacenado en localStorage
5. Refresh página
6. ✓ Mantiene idioma seleccionado
```

### Test 7: Tema Oscuro/Claro
```
1. Click botón tema (sol/luna)
2. ✓ Interfaz cambia a tema oscuro
3. Click nuevamente
4. ✓ Vuelve a tema claro
5. Cambiar preferencia del SO (si posible)
6. ✓ Se refleja automáticamente (primera carga)
```

### Test 8: JWT en Requests
```
1. Abrir DevTools Console
2. Red > hacer cambios (crear scorecard, agregar amigo)
3. Inspeccionar request headers
4. ✓ Authorization: Bearer <token> presente
5. Eliminar token de localStorage manualmente
6. ✓ Request fallará (401 Unauthorized)
```

---

## 📊 API Testing (Curl/Postman)

```bash
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@golf.com","password":"pass123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@golf.com","password":"pass123"}'

# Crear scorecard (con TOKEN del login)
curl -X POST http://localhost:4000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"date":"2024-12-15","course":"Punta","strokes":85,"par":72}'

# Get feed
curl -X GET http://localhost:4000/api/items \
  -H "Authorization: Bearer <TOKEN>"

# Search users
curl -X GET "http://localhost:4000/api/users/search?q=test"

# Add friend
curl -X POST http://localhost:4000/api/friends/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"friendId":"2"}'
```

---

## 🎯 Success Criteria

| Feature | Expected | Status |
|---------|----------|--------|
| Login/Register | JWT generado y almacenado | ✅ |
| JWT en requests | Authorization header presente | ✅ |
| Crear scorecard | Aparece en feed, handicap calculado | ✅ |
| Eliminar scorecard | Solo owner puede, desaparece de feed | ✅ |
| Agregar amigos | Buscar y agregar, aparece en friends list | ✅ |
| Feed de amigos | Ver scorecards de amigos + propias | ✅ |
| Handicap agregado | Promedio últimas 20 rondas | ✅ |
| i18n funcional | Cambiar ES/EN, persistencia | ✅ |
| Tema oscuro | Toggle trabajando, persistencia | ✅ |
| Responsive | Mobile/desktop funciona bien | ✅ |
| Documentación | README completo con ejemplos | ✅ |

---

## 🚀 Deployment Checklist

- [ ] Backend: Cambiar PORT a variable de entorno
- [ ] Frontend: Cambiar baseURL a variable de entorno (para apuntar a backend real)
- [ ] Base de datos: Migrar de JSON a PostgreSQL/MongoDB
- [ ] Validación: Agregar validación de emails real
- [ ] HTTPS: Obtener certificado SSL
- [ ] Logging: Implementar logging en backend
- [ ] Tests: Agregar tests automáticos
- [ ] Rate limiting: Protección contra spam
- [ ] Error handling: Mejorar manejo de errores

---

## 📝 Notas Finales

✅ **El proyecto está 100% funcional en desarrollo local**

### Próximos Pasos (Futura):
1. Cambiar base de datos JSON a PostgreSQL
2. Agregar tests con Jest + React Testing Library
3. Implementar SSO (Google OAuth)
4. Deploy a Vercel (frontend) + Heroku (backend)
5. Implementar WebSockets para notificaciones en tiempo real
6. Agregar gamificación (badges, leaderboard)

### Limitaciones Actuales:
- Base de datos en archivos (no escala)
- Handicap simplificado (no es USGA official)
- Sin validación de email real
- Sin rate limiting

---

**¡Proyecto completado! ⛳**
