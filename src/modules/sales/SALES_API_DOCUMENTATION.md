# 📊 Documentación API - Módulo de Ventas

## Descripción General
El módulo de **Sales** (Ventas) es responsable de la gestión completa del ciclo de vida de las ventas, incluyendo:
- Creación de nuevas ventas
- Gestión de detalles de venta (items)
- Control de inventario automático
- Estados de venta (pendiente, pagada, cancelada)
- Métodos de pago
- Reportes de ventas

---

## 🔐 Autenticación
**Todos los endpoints están protegidos con JWT (JSON Web Token)**

- **Guard**: `JwtAuthGuard`
- **Ubicación**: `src/modules/auth/guards/jwt-auth.guard.ts`
- **Requerimiento**: Incluir token en el header `Authorization: Bearer <token>`

---

## 📋 Enumeraciones

### SaleStatus (Estado de Venta)
```
- PENDING = 'pendiente'      (Estado inicial por defecto)
- PAID = 'pagada'             (Venta completada y pagada)
- CANCELLED = 'cancelada'     (Venta cancelada)
```

### PaymentMethod (Método de Pago)
```
- CASH = 'efectivo'           (Pago en efectivo)
- CARD = 'tarjeta'            (Pago con tarjeta)
- TRANSFER = 'transferencia'  (Transferencia bancaria)
- OTHER = 'otro'              (Otro método)
```

---

## 🔌 Endpoints

### 1️⃣ CREATE - Crear una Nueva Venta
**Endpoint:** `POST /sales`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `201 CREATED`

**Body (Solicitud):**
```json
{
  "userId": "uuid-del-usuario",
  "fecha": "2026-02-22T10:30:00Z",
  "metodo_pago": "efectivo",
  "items": [
    {
      "productId": 1,
      "cantidad": 5
    },
    {
      "productId": 2,
      "cantidad": 3
    }
  ]
}
```

**Parámetros de Body:**
| Campo | Tipo | Requerido | Descripción | Validación |
|-------|------|-----------|-------------|-----------|
| `userId` | UUID (string) | ✅ Sí | ID del usuario propietario de la venta | Debe existir en la base de datos |
| `fecha` | ISO 8601 Date String | ❌ No | Fecha de la venta | Si no se proporciona, se usa la fecha actual |
| `metodo_pago` | enum | ❌ No | Método de pago utilizado | `efectivo`, `tarjeta`, `transferencia`, `otro` |
| `items` | Array | ✅ Sí | Lista de productos vendidos | Mínimo 1 item requerido |
| `items[].productId` | number | ✅ Sí | ID del producto a vender | El producto debe existir |
| `items[].cantidad` | number | ✅ Sí | Cantidad vendida | Mínimo 1, no puede exceder inventario |

**Response (Respuesta Exitosa):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha": "2026-02-22T10:30:00.000Z",
  "total_venta": "240.00",
  "metodo_pago": "efectivo",
  "estado": "pendiente",
  "userId": "uuid-del-usuario",
  "createdAt": "2026-02-22T10:30:00.000Z",
  "updatedAt": "2026-02-22T10:30:00.000Z",
  "saleDetails": [
    {
      "id": "detail-uuid-1",
      "cantidad": 5,
      "precio_unitario": "40.00",
      "subtotal": "200.00",
      "productId": 1,
      "saleId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-22T10:30:00.000Z",
      "updatedAt": "2026-02-22T10:30:00.000Z"
    },
    {
      "id": "detail-uuid-2",
      "cantidad": 3,
      "precio_unitario": "13.33",
      "subtotal": "40.00",
      "productId": 2,
      "saleId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-02-22T10:30:00.000Z",
      "updatedAt": "2026-02-22T10:30:00.000Z"
    }
  ]
}
```

**Errores Posibles:**
| Código | Mensaje | Descripción |
|--------|---------|-------------|
| `400` | `La venta debe contener al menos un producto` | El array items está vacío |
| `400` | `El producto {nombre} no pertenece a este usuario` | Producto pertenece a otro usuario |
| `400` | `Inventario insuficiente para el producto {nombre}. Disponible: {x}, Solicitado: {y}` | No hay suficiente stock |
| `404` | `Usuario no encontrado` | El usuario no existe |
| `404` | `Producto no encontrado` | El producto no existe |

**Validaciones Automáticas:**
- ✅ El usuario debe existir en la BD
- ✅ Cada producto debe existir y pertenecer al usuario
- ✅ El inventario se descuenta automáticamente
- ✅ El total se calcula automáticamente (precio_unitario × cantidad)
- ✅ Se crean registros en `SaleDetail` para cada item

---

### 2️⃣ FIND ALL - Obtener Todas las Ventas
**Endpoint:** `GET /sales`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `200 OK`

**Query Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `userId` | string (UUID) | ❌ No | Filtrar ventas por usuario |

**Ejemplo de Solicitud:**
```
GET /sales                          (Todas las ventas)
GET /sales?userId=abc123...         (Ventas de un usuario específico)
```

**Response (Respuesta Exitosa):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fecha": "2026-02-22T10:30:00.000Z",
    "total_venta": "240.00",
    "metodo_pago": "efectivo",
    "estado": "pendiente",
    "userId": "uuid-del-usuario",
    "createdAt": "2026-02-22T10:30:00.000Z",
    "updatedAt": "2026-02-22T10:30:00.000Z",
    "saleDetails": [
      {
        "id": "detail-uuid-1",
        "cantidad": 5,
        "precio_unitario": "40.00",
        "subtotal": "200.00",
        "productId": 1
      }
    ]
  }
]
```

**Notas:**
- Las ventas se ordenan por fecha descendente (más recientes primero)
- Cada venta incluye sus detalles (`saleDetails`) con información del producto

---

### 3️⃣ FIND ONE - Obtener una Venta por ID
**Endpoint:** `GET /sales/:id`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `200 OK`

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | ID de la venta a consultar |

**Ejemplo de Solicitud:**
```
GET /sales/550e8400-e29b-41d4-a716-446655440000
```

**Response (Respuesta Exitosa):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha": "2026-02-22T10:30:00.000Z",
  "total_venta": "240.00",
  "metodo_pago": "efectivo",
  "estado": "pendiente",
  "userId": "uuid-del-usuario",
  "createdAt": "2026-02-22T10:30:00.000Z",
  "updatedAt": "2026-02-22T10:30:00.000Z",
  "user": {
    "id": "uuid-del-usuario",
    "nombre": "Juan",
    "apellido": "Pérez"
  },
  "saleDetails": [
    {
      "id": "detail-uuid-1",
      "cantidad": 5,
      "precio_unitario": "40.00",
      "subtotal": "200.00",
      "productId": 1,
      "product": {
        "id": 1,
        "nombre": "Producto A",
        "precioVenta": "40.00"
      }
    }
  ]
}
```

**Errores Posibles:**
| Código | Mensaje |
|--------|---------|
| `404` | `Venta con ID {id} no encontrada` |

---

### 4️⃣ UPDATE - Actualizar una Venta
**Endpoint:** `PATCH /sales/:id`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `200 OK`

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | ID de la venta a actualizar |

**Body (Solicitud):**
```json
{
  "estado": "pagada",
  "metodo_pago": "tarjeta",
  "items": [
    {
      "id": "detalle-uuid-existente",      // opcional para editar
      "cantidad": 5                         // o productId si se cambia producto
    },
    {
      "productId": 10,                     // sin id = nuevo detalle
      "cantidad": 2
    }
  ]
}
```

**Parámetros de Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `estado` | enum | ❌ No | `pendiente`, `pagada`, `cancelada` |
| `metodo_pago` | enum | ❌ No | `efectivo`, `tarjeta`, `transferencia`, `otro` |
| `items` | Array de objetos `UpdateSaleDetailDto` | ❌ No | Permite modificar/eliminar/añadir detalles |

#### Estructura de `UpdateSaleDetailDto`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Si se especifica, se actualizará el detalle existente. Debe pertenecer a la venta. |
| `productId` | number | Nuevo producto (alternativo a id) |
| `cantidad` | number | Cantidad a vender (mínimo 1) |

> **Notas importantes:**
> - Los detalles que no aparezcan en el array `items` serán eliminados automáticamente del registro **y** de la base de datos; el inventario se restaurará para esos productos.
> - Internamente se actualiza también la colección `sale.saleDetails` para prevenir que TypeORM re-inserte los registros eliminados.
> - Si se incluye un `id` que **no pertenece a la venta**, se lanzará un error similar a:
>   `Detalle de venta con ID xxxx no encontrado en la venta yyyy`.
> - Para agregar nuevos ítems simplemente deje el campo `id` ausente.
> - Omita por completo `items` si no desea modificar los detalles.

**Response (Respuesta Exitosa):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha": "2026-02-22T10:30:00.000Z",
  "total_venta": "240.00",
  "metodo_pago": "tarjeta",
  "estado": "pagada",
  "userId": "uuid-del-usuario",
  "updatedAt": "2026-02-22T10:35:00.000Z"
}
```

**Lógica de Negocio:**
- **Cambio a CANCELLED**: Si la venta estaba en estado `PAID`, el inventario se restaura automáticamente
- **Restricción**: No se puede actualizar una venta ya cancelada
- Solo se pueden cambiar: `estado` y `metodo_pago`

**Errores Posibles:**
| Código | Mensaje |
|--------|---------|
| `400` | `No se puede actualizar una venta cancelada` |
| `404` | `Venta con ID {id} no encontrada` |

---

### 5️⃣ DELETE - Eliminar una Venta
**Endpoint:** `DELETE /sales/:id`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `204 NO CONTENT`

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | string (UUID) | ID de la venta a eliminar |

**Ejemplo de Solicitud:**
```
DELETE /sales/550e8400-e29b-41d4-a716-446655440000
```

**Response (Respuesta Exitosa):**
```
(Sin cuerpo - HTTP 204)
```

**Lógica de Negocio:**
- ✅ El inventario se restaura automáticamente
- ✅ Se eliminan todos los `SaleDetails` asociados (cascada)
- ❌ No hay respuesta en el cuerpo

**Errores Posibles:**
| Código | Mensaje |
|--------|---------|
| `404` | `Venta con ID {id} no encontrada` |

---

### 6️⃣ GET REPORT - Obtener Reporte de Ventas por Usuario
**Endpoint:** `GET /sales/report/:userId`

**Protección:** ✅ Requiere JWT

**HTTP Status:** `200 OK`

**Path Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `userId` | string (UUID) | ID del usuario para generar el reporte |

**Ejemplo de Solicitud:**
```
GET /sales/report/abc-123-uuid
```

**Response (Respuesta Exitosa):**
```json
{
  "totalVentas": 15,
  "ventasPagadas": 10,
  "ventasCanceladas": 2,
  "montoTotal": 5000.50,
  "montoPagado": 4250.75,
  "metodoPago": {
    "efectivo": {
      "cantidad": 5,
      "monto": 1200.00
    },
    "tarjeta": {
      "cantidad": 8,
      "monto": 3050.75
    },
    "transferencia": {
      "cantidad": 2,
      "monto": 750.00
    }
  }
}
```

**Parámetros de Respuesta:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `totalVentas` | number | Total de ventas registradas |
| `ventasPagadas` | number | Cantidad de ventas con estado PAID |
| `ventasCanceladas` | number | Cantidad de ventas con estado CANCELLED |
| `montoTotal` | number | Suma total de todas las ventas |
| `montoPagado` | number | Suma de ventas en estado PAID |
| `metodoPago` | object | Desglose por método de pago |

---

## 🗂️ Estructura de Datos

### Sale Entity (Tabla: sales)
```typescript
{
  id: string (UUID),                  // ID único
  fecha: Date,                        // Fecha de la venta
  total_venta: decimal(12,2),        // Monto total
  metodo_pago: enum,                 // Método de pago usado
  estado: enum,                      // Estado actual
  userId: string (FK),               // ID del usuario
  createdAt: Date,                   // Fecha de creación
  updatedAt: Date,                   // Fecha de actualización
  user: User,                        // Relación con usuario
  saleDetails: SaleDetail[]          // Array de detalles
}
```

### SaleDetail Entity (Tabla: sale_details)
```typescript
{
  id: string (UUID),                 // ID único
  cantidad: number,                  // Cantidad vendida
  precio_unitario: decimal(10,2),   // Precio por unidad
  subtotal: decimal(12,2),          // cantidad × precio_unitario
  productId: number (FK),            // ID del producto
  saleId: string (FK),               // ID de la venta
  createdAt: Date,                   // Fecha de creación
  updatedAt: Date,                   // Fecha de actualización
  sale: Sale,                        // Relación con venta
  product: Product                   // Relación con producto
}
```

---

## 📦 Validaciones Implementadas

### En CreateSaleDto:
- ✅ `userId`: Debe ser UUID válido y requerido
- ✅ `fecha`: Debe estar en formato ISO 8601 (opcional)
- ✅ `metodo_pago`: Debe ser un enum válido (opcional)
- ✅ `items`: Debe ser un array no vacío (requerido)
- ✅ `items[].productId`: Debe ser número (requerido)
- ✅ `items[].cantidad`: Debe ser número ≥ 1 (requerido)

### En UpdateSaleDto:
- ✅ `estado`: Debe ser enum válido (opcional)
- ✅ `metodo_pago`: Debe ser enum válido (opcional)

### En el Servicio:
- ✅ Usuario debe existir
- ✅ Cada producto debe existir
- ✅ Los productos deben pertenecer al usuario
- ✅ Debe haber inventario suficiente
- ✅ No se puede actualizar ventas canceladas

---

## 🔄 Flujo de Relaciones

```
Usuario (User)
    ↓
Venta (Sale) [1:N]
    ↓
Detalles de Venta (SaleDetail) [1:N]
    ↓
Producto (Product)
```

---

## 🔗 Dependencias

El módulo de Ventas depende de:
- **UsersModule**: Para validar que el usuario exista
- **ProductsModule**: Para validar productos y ajustar inventario

---

## 💡 Casos de Uso Comunes

### Caso 1: Crear una venta completa
```
1. POST /sales (con items)
2. Sistema valida usuario, productos e inventario
3. Sistema crea venta + detalles
4. Sistema descuenta inventario
5. Se retorna venta con detalles completos
```

### Caso 2: Cambiar estado a pagada
```
1. PATCH /sales/{id}
2. Body: { "estado": "pagada" }
3. Se actualiza la venta
```

### Caso 3: Cancelar venta pagada
```
1. PATCH /sales/{id}
2. Body: { "estado": "cancelada" }
3. Si estaba en PAID, inventario se restaura
```

### Caso 4: Generar reporte
```
1. GET /sales/report/{userId}
2. Sistema calcula estadísticas
3. Se retorna reporte con totales y desglose por método pago
```

---

## 📝 Notas Importantes

1. **Descuento de Inventario**: Se realiza automáticamente al crear la venta
2. **Restauración de Inventario**: Ocurre al cancelar una venta PAID o al eliminarla
3. **Cascade Delete**: Al eliminar una venta, se eliminan automáticamente sus detalles
4. **JWT Obligatorio**: Todos los endpoints requieren autenticación
5. **Cálculos Automáticos**: El total se calcula en el backend, no se acepta como input
6. **Ordenes de Venta**: Se ordenan por fecha descendente por defecto

---

## 🧪 Ejemplo de Solicitud Completa (cURL)

```bash
# 1. Crear venta
curl -X POST http://localhost:3000/sales \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "metodo_pago": "efectivo",
    "items": [
      {
        "productId": 1,
        "cantidad": 5
      }
    ]
  }'

# 2. Obtener todas las ventas
curl -X GET http://localhost:3000/sales \
  -H "Authorization: Bearer TU_JWT_TOKEN"

# 3. Obtener una venta específica
curl -X GET http://localhost:3000/sales/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_JWT_TOKEN"

# 4. Actualizar venta (cambiar estado)
curl -X PATCH http://localhost:3000/sales/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "pagada"
  }'

# 5. Obtener reporte
curl -X GET http://localhost:3000/sales/report/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_JWT_TOKEN"

# 6. Eliminar venta
curl -X DELETE http://localhost:3000/sales/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TU_JWT_TOKEN"
```

---

**Última actualización**: 22 de Febrero, 2026
