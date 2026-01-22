# 🧪 Ejemplos de Prueba - Autenticación JWT

## 📋 Índice
1. [Usuarios](#usuarios)
2. [Productos](#productos)
3. [Ventas](#ventas)
4. [Autenticación](#autenticación)

---

## 👥 Usuarios

### 1. Crear Usuario (Público)
**Endpoint:** `POST /users`

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123"
  }'
```

**Respuesta Exitosa (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "createdAt": "2024-01-22T10:00:00Z",
  "updatedAt": "2024-01-22T10:00:00Z"
}
```

---

### 2. Obtener Token (Público)
**Endpoint:** `POST /auth/login/:userId`

```bash
curl -X POST http://localhost:3000/auth/login/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta Exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6Impyb3RlcEBlbWFpbC5jb20iLCJpYXQiOjE3MDU5MDE0MzQsImV4cCI6MTcwNjUwNjIzNH0.dGs_EfZIYf..."
}
```

---

### 3. Obtener Todos los Usuarios (Protegido)
**Endpoint:** `GET /users`

```bash
# Guarda el token en una variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-01-22T10:00:00Z",
    "updatedAt": "2024-01-22T10:00:00Z"
  }
]
```

**Sin Token (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### 4. Obtener Usuario por ID (Protegido)
**Endpoint:** `GET /users/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Actualizar Usuario (Protegido)
**Endpoint:** `PATCH /users/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Juan Carlos Pérez"
  }'
```

---

### 6. Eliminar Usuario (Protegido)
**Endpoint:** `DELETE /users/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (204):** Sin contenido

---

## 🛒 Productos

### 1. Obtener Todos los Productos (Público)
**Endpoint:** `GET /products`

```bash
curl -X GET http://localhost:3000/products
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "nombre": "Helado Vanilla",
    "descripcion": "Helado de vainilla premium",
    "precio": 5.50,
    "stock": 100,
    "createdAt": "2024-01-22T10:00:00Z",
    "updatedAt": "2024-01-22T10:00:00Z"
  }
]
```

---

### 2. Obtener Producto por ID (Público)
**Endpoint:** `GET /products/:id`

```bash
curl -X GET http://localhost:3000/products/660e8400-e29b-41d4-a716-446655440000
```

---

### 3. Crear Producto (Protegido)
**Endpoint:** `POST /products`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Helado Fresa",
    "descripcion": "Helado de fresa natural",
    "precio": 5.50,
    "stock": 150,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

---

### 4. Actualizar Producto (Protegido)
**Endpoint:** `PATCH /products/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PATCH http://localhost:3000/products/660e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "precio": 6.00,
    "stock": 200
  }'
```

---

### 5. Eliminar Producto (Protegido)
**Endpoint:** `DELETE /products/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X DELETE http://localhost:3000/products/660e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💰 Ventas

### 1. Crear Venta (Protegido)
**Endpoint:** `POST /sales`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "total": 25.50,
    "fecha": "2024-01-22T10:00:00Z",
    "detalles": [
      {
        "productId": "660e8400-e29b-41d4-a716-446655440000",
        "cantidad": 3,
        "precioUnitario": 5.50,
        "subtotal": 16.50
      },
      {
        "productId": "770e8400-e29b-41d4-a716-446655440000",
        "cantidad": 2,
        "precioUnitario": 4.50,
        "subtotal": 9.00
      }
    ]
  }'
```

---

### 2. Obtener Todas las Ventas (Protegido)
**Endpoint:** `GET /sales`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/sales \
  -H "Authorization: Bearer $TOKEN"
```

---

### 3. Obtener Ventas de un Usuario (Protegido)
**Endpoint:** `GET /sales?userId=550e8400-e29b-41d4-a716-446655440000`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/sales?userId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. Obtener Venta por ID (Protegido)
**Endpoint:** `GET /sales/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/sales/880e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. Obtener Reporte de Ventas (Protegido)
**Endpoint:** `GET /sales/report/:userId`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/sales/report/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. Actualizar Venta (Protegido)
**Endpoint:** `PATCH /sales/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X PATCH http://localhost:3000/sales/880e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "total": 30.00
  }'
```

---

### 7. Eliminar Venta (Protegido)
**Endpoint:** `DELETE /sales/:id`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X DELETE http://localhost:3000/sales/880e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔑 Autenticación

### 1. Ver Datos del Usuario Autenticado (Protegido)
**Endpoint:** `GET /auth/me`

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Respuesta Exitosa (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "juan@example.com"
}
```

---

## 📝 Scripts de Bash para Prueba Rápida

Crea un archivo `test-api.sh`:

```bash
#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}1. Creando usuario...${NC}"
USER_RESPONSE=$(curl -s -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }')

USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Usuario creado: $USER_ID${NC}"

echo -e "${BLUE}2. Obteniendo token...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login/$USER_ID)
TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Token obtenido: ${TOKEN:0:20}...${NC}"

echo -e "${BLUE}3. Accediendo a endpoint protegido...${NC}"
curl -s -X GET $BASE_URL/users \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "${BLUE}4. Ver datos del usuario autenticado...${NC}"
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "${GREEN}✅ Prueba completada!${NC}"
```

Ejecutar:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## ⚠️ Códigos de Error Comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| 400 | Bad Request | Verifica que el JSON sea válido |
| 401 | Unauthorized | Incluye un token válido en el header Authorization |
| 403 | Forbidden | No tienes permiso para acceder a este recurso |
| 404 | Not Found | El recurso no existe |
| 409 | Conflict | El email ya está registrado |
| 500 | Internal Server Error | Error del servidor, verifica los logs |

---

## 💡 Tips Útiles

1. **Guardar token en variable de entorno:**
   ```bash
   export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   curl -X GET http://localhost:3000/users -H "Authorization: Bearer $TOKEN"
   ```

2. **Usar jq para formatear JSON:**
   ```bash
   curl -s http://localhost:3000/products | jq '.'
   ```

3. **Decodificar JWT:**
   ```bash
   # Usar jwt.io o instalar jq-jwt
   echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." | base64 -d | jq '.'
   ```

4. **Ver headers de respuesta:**
   ```bash
   curl -i http://localhost:3000/products
   ```

---

**¡Listo para empezar a probar! 🚀**
