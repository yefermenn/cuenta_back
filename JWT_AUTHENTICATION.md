# Autenticación JWT

## 📋 Descripción

El proyecto ahora está protegido con **autenticación JWT (JSON Web Token)**. Los endpoints que requieren autenticación están marcados con `@UseGuards(JwtAuthGuard)`.

## 🔑 Cómo obtener un Token

### 1. Crear un usuario (Público)
```bash
POST /users
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "contraseña123"
}
```

### 2. Obtener un Token JWT
Una vez que el usuario existe, obtén un token con su ID:

```bash
POST /auth/login/{userId}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Usar el Token en las peticiones protegidas

Incluye el token en el header `Authorization`:

```bash
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Endpoints Protegidos vs Públicos

### 🔓 Endpoints Públicos (Sin autenticación)

#### Users
- `POST /users` - Crear un nuevo usuario
- `GET /auth/login/:userId` - Obtener token JWT

#### Products
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener un producto por ID

### 🔐 Endpoints Protegidos (Requieren JWT)

#### Users
- `GET /users` - Obtener todos los usuarios
- `GET /users/:id` - Obtener un usuario por ID
- `PATCH /users/:id` - Actualizar un usuario
- `DELETE /users/:id` - Eliminar un usuario

#### Products
- `POST /products` - Crear un nuevo producto
- `PATCH /products/:id` - Actualizar un producto
- `DELETE /products/:id` - Eliminar un producto

#### Sales
- `POST /sales` - Crear una nueva venta
- `GET /sales` - Obtener todas las ventas
- `GET /sales/:id` - Obtener una venta por ID
- `GET /sales/report/:userId` - Obtener reporte de ventas
- `PATCH /sales/:id` - Actualizar una venta
- `DELETE /sales/:id` - Eliminar una venta

#### Auth
- `GET /auth/me` - Obtener datos del usuario autenticado (Requiere JWT)

## 🔧 Configuración

### Variable de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
```

**⚠️ IMPORTANTE:** En producción, cambia el secreto a algo mucho más seguro y único.

## 📊 Estructura del Token

El token JWT contiene los siguientes datos del usuario:

```json
{
  "sub": "user-id",
  "email": "usuario@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

- `sub`: ID del usuario
- `email`: Email del usuario
- `role`: Rol del usuario
- `iat`: Fecha de emisión del token
- `exp`: Fecha de expiración (7 días por defecto)

## 📝 Flujo Completo de Ejemplo

### 1. Crear usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-22T10:00:00Z"
}
```

### 2. Obtener token
```bash
curl -X POST http://localhost:3000/auth/login/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Usar el token
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "juan@example.com",
  "role": "user"
}
```

## ⚠️ Errores Comunes

### 401 Unauthorized
- Token no proporcionado
- Token expirado
- Token inválido

### 403 Forbidden
- Acceso denegado (generalmente por permisos)

### Solución
Asegúrate de incluir un token válido en el header `Authorization: Bearer <token>`

## 🚀 Próximos Pasos (Opcionales)

Para un sistema más completo, considera:

1. **Endpoint de Login real**: Validar email y contraseña
2. **Roles y Permisos**: Crear un sistema RBAC (Role-Based Access Control)
3. **Refresh Tokens**: Implementar tokens de refresco
4. **Rate Limiting**: Limitar intentos de login
5. **Logout**: Invalidar tokens
