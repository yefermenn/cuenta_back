# API Reference - Backend Heladería

## Configuración

### Base URL
```
http://localhost:3000
```

### Headers
```
Content-Type: application/json
```

---

## 👥 Users (Usuarios)

### Crear Usuario
```http
POST /users
Content-Type: application/json

{
  "nombre": "Juan Pérez García",
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez García",
  "email": "juan@example.com",
  "createdAt": "2024-01-17T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:30:00.000Z"
}
```

### Listar Todos los Usuarios
```http
GET /users
```

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan Pérez García",
    "email": "juan@example.com",
    "createdAt": "2024-01-17T10:30:00.000Z",
    "updatedAt": "2024-01-17T10:30:00.000Z",
    "products": [],
    "sales": []
  }
]
```

### Obtener Usuario por ID
```http
GET /users/{userId}
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez García",
  "email": "juan@example.com",
  "createdAt": "2024-01-17T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:30:00.000Z",
  "products": [],
  "sales": []
}
```

### Actualizar Usuario
```http
PATCH /users/{userId}
Content-Type: application/json

{
  "nombre": "Juan Pérez García Actualizado",
  "password": "NewSecurePass456"
}
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez García Actualizado",
  "email": "juan@example.com",
  "updatedAt": "2024-01-17T11:00:00.000Z"
}
```

### Eliminar Usuario
```http
DELETE /users/{userId}
```

**Response 204:** (Sin contenido)

---

## 🍦 Products (Productos)

### Crear Producto
```http
POST /products
Content-Type: application/json

{
  "nombre": "Helado de Vainilla",
  "precio": 5.99,
  "codigo": "VANILLA-001",
  "inventario": 100,
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response 201:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "nombre": "Helado de Vainilla",
  "precio": 5.99,
  "codigo": "VANILLA-001",
  "inventario": 100,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-17T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:30:00.000Z"
}
```

### Listar Productos
```http
GET /products
```

### Listar Productos de un Usuario
```http
GET /products?userId={userId}
```

**Response 200:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "nombre": "Helado de Vainilla",
    "precio": 5.99,
    "codigo": "VANILLA-001",
    "inventario": 100,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-17T10:30:00.000Z",
    "updatedAt": "2024-01-17T10:30:00.000Z",
    "saleDetails": []
  }
]
```

### Obtener Producto por ID
```http
GET /products/{productId}
```

**Response 200:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "nombre": "Helado de Vainilla",
  "precio": 5.99,
  "codigo": "VANILLA-001",
  "inventario": 100,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-17T10:30:00.000Z",
  "updatedAt": "2024-01-17T10:30:00.000Z",
  "saleDetails": []
}
```

### Actualizar Producto
```http
PATCH /products/{productId}
Content-Type: application/json

{
  "nombre": "Helado de Vainilla Premium",
  "precio": 6.99,
  "inventario": 150
}
```

**Response 200:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "nombre": "Helado de Vainilla Premium",
  "precio": 6.99,
  "codigo": "VANILLA-001",
  "inventario": 150,
  "updatedAt": "2024-01-17T11:00:00.000Z"
}
```

### Eliminar Producto
```http
DELETE /products/{productId}
```

**Response 204:** (Sin contenido)

---

## 🧾 Sales (Ventas)

### Crear Venta
```http
POST /sales
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "fecha": "2024-01-17T15:30:00Z",
  "metodo_pago": "efectivo",
  "items": [
    {
      "productId": "660e8400-e29b-41d4-a716-446655440000",
      "cantidad": 2
    },
    {
      "productId": "770e8400-e29b-41d4-a716-446655440000",
      "cantidad": 1
    }
  ]
}
```

**Response 201:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440000",
  "fecha": "2024-01-17T15:30:00.000Z",
  "total_venta": 17.97,
  "metodo_pago": "efectivo",
  "estado": "pendiente",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-17T15:30:00.000Z",
  "updatedAt": "2024-01-17T15:30:00.000Z",
  "saleDetails": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "cantidad": 2,
      "precio_unitario": 5.99,
      "subtotal": 11.98,
      "productId": "660e8400-e29b-41d4-a716-446655440000"
    },
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "cantidad": 1,
      "precio_unitario": 5.99,
      "subtotal": 5.99,
      "productId": "770e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

### Listar Todas las Ventas
```http
GET /sales
```

### Listar Ventas de un Usuario
```http
GET /sales?userId={userId}
```

**Response 200:**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "fecha": "2024-01-17T15:30:00.000Z",
    "total_venta": 17.97,
    "metodo_pago": "efectivo",
    "estado": "pendiente",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-17T15:30:00.000Z",
    "updatedAt": "2024-01-17T15:30:00.000Z",
    "saleDetails": []
  }
]
```

### Obtener Venta por ID
```http
GET /sales/{saleId}
```

**Response 200:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440000",
  "fecha": "2024-01-17T15:30:00.000Z",
  "total_venta": 17.97,
  "metodo_pago": "efectivo",
  "estado": "pendiente",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-17T15:30:00.000Z",
  "updatedAt": "2024-01-17T15:30:00.000Z",
  "saleDetails": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440000",
      "cantidad": 2,
      "precio_unitario": 5.99,
      "subtotal": 11.98,
      "productId": "660e8400-e29b-41d4-a716-446655440000",
      "product": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "nombre": "Helado de Vainilla",
        "precio": 5.99,
        "codigo": "VANILLA-001",
        "inventario": 98
      }
    }
  ]
}
```

### Actualizar Estado de Venta
```http
PATCH /sales/{saleId}
Content-Type: application/json

{
  "estado": "pagada",
  "metodo_pago": "tarjeta"
}
```

**Estados válidos:** `pendiente`, `pagada`, `cancelada`
**Métodos de pago válidos:** `efectivo`, `tarjeta`, `transferencia`, `otro`

**Response 200:**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440000",
  "estado": "pagada",
  "metodo_pago": "tarjeta",
  "updatedAt": "2024-01-17T16:00:00.000Z"
}
```

### Obtener Reporte de Ventas
```http
GET /sales/report/{userId}
```

**Response 200:**
```json
{
  "totalVentas": 10,
  "ventasPagadas": 8,
  "ventasCanceladas": 2,
  "montoTotal": 1500.50,
  "montoPagado": 1200.00,
  "metodoPago": {
    "efectivo": {
      "cantidad": 5,
      "monto": 600.00
    },
    "tarjeta": {
      "cantidad": 3,
      "monto": 600.00
    },
    "no especificado": {
      "cantidad": 2,
      "monto": 300.50
    }
  }
}
```

### Eliminar Venta
```http
DELETE /sales/{saleId}
```

**Response 204:** (Sin contenido)

---

## ❌ Códigos de Error

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "La venta debe contener al menos un producto",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Usuario con ID xxx no encontrado",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "El correo electrónico ya está registrado",
  "error": "Conflict"
}
```

### 422 Unprocessable Entity (Validación)
```json
{
  "statusCode": 422,
  "message": [
    {
      "field": "email",
      "message": "email must be an email"
    }
  ],
  "error": "Unprocessable Entity"
}
```

---

## 📝 Notas Importantes

1. **Sincronización de Base de Datos**: Con `synchronize: true`, la BD se actualiza automáticamente con cambios en entidades durante desarrollo.

2. **Encriptación de Contraseñas**: Las contraseñas se encriptan automáticamente con bcrypt (10 rondas).

3. **Inventario**: Al crear una venta, el inventario se descuenta automáticamente. Si se cancela la venta, se restaura.

4. **UUIDs**: Todos los IDs son UUID v4 generados automáticamente.

5. **Timestamps**: `createdAt` y `updatedAt` se actualizan automáticamente en TypeORM.

6. **Validación**: Todos los DTOs tienen validación de datos con `class-validator`.

---

## 🔄 Ejemplo de Flujo Completo

```
1. Crear usuario
   POST /users
   
2. Crear productos
   POST /products (x2)
   
3. Crear venta
   POST /sales
   (inventario se descuenta automáticamente)
   
4. Actualizar estado de venta
   PATCH /sales/{id}
   
5. Obtener reporte
   GET /sales/report/{userId}
```
