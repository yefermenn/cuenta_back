# Backend Heladería - NestJS

Estructura completa de backend modular y escalable para un sistema de gestión de ventas de heladería.

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── database.config.ts          # Configuración de TypeORM
├── modules/
│   ├── users/
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── products/
│   │   ├── entities/
│   │   │   └── product.entity.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   └── update-product.dto.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   └── sales/
│       ├── entities/
│       │   ├── sale.entity.ts
│       │   └── sale-detail.entity.ts
│       ├── dto/
│       │   ├── create-sale.dto.ts
│       │   └── update-sale.dto.ts
│       ├── sales.controller.ts
│       ├── sales.service.ts
│       └── sales.module.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

## 🔐 Módulo de Usuarios (Users)

### Entidad User
- **id**: UUID (clave primaria)
- **nombre**: Nombre del dueño de la heladería
- **email**: Correo electrónico (único)
- **password**: Contraseña encriptada con bcrypt
- **createdAt**: Fecha de creación
- **updatedAt**: Fecha de última actualización
- **relationships**: 
  - OneToMany → Products
  - OneToMany → Sales

### Endpoints
```
POST   /users               # Crear usuario
GET    /users               # Listar usuarios
GET    /users/:id           # Obtener usuario por ID
PATCH  /users/:id           # Actualizar usuario
DELETE /users/:id           # Eliminar usuario
```

### Características
- ✅ Encriptación de contraseña con bcrypt
- ✅ Validación de email único
- ✅ DTOs con validaciones
- ✅ Manejo de excepciones

## 🍦 Módulo de Productos (Products)

### Entidad Product
- **id**: UUID (clave primaria)
- **nombre**: Nombre del producto
- **precio**: Precio unitario (decimal)
- **codigo**: SKU único por usuario
- **inventario**: Stock actual
- **userId**: Referencia a User (ManyToOne)
- **createdAt**: Fecha de creación
- **updatedAt**: Fecha de última actualización
- **relationships**:
  - ManyToOne → User
  - OneToMany → SaleDetails

### Endpoints
```
POST   /products                # Crear producto
GET    /products                # Listar productos
GET    /products?userId=<id>    # Listar productos de un usuario
GET    /products/:id            # Obtener producto por ID
PATCH  /products/:id            # Actualizar producto
DELETE /products/:id            # Eliminar producto
```

### Características
- ✅ SKU único por usuario
- ✅ Control de inventario
- ✅ Métodos para aumentar/disminuir stock
- ✅ Validación de precios y cantidades

## 🧾 Módulo de Ventas (Sales)

### Entidad Sale
- **id**: UUID (clave primaria)
- **fecha**: Fecha de la venta
- **total_venta**: Total calculado automáticamente (decimal)
- **metodo_pago**: Efectivo, Tarjeta, Transferencia, Otro (nullable)
- **estado**: Pendiente, Pagada, Cancelada
- **userId**: Referencia a User (ManyToOne)
- **createdAt**: Fecha de creación
- **updatedAt**: Fecha de última actualización
- **relationships**:
  - ManyToOne → User
  - OneToMany → SaleDetails

### Entidad SaleDetail
- **id**: UUID (clave primaria)
- **cantidad**: Cantidad vendida
- **precio_unitario**: Precio en el momento de la venta
- **subtotal**: cantidad × precio_unitario (calculado)
- **saleId**: Referencia a Sale (ManyToOne)
- **productId**: Referencia a Product (ManyToOne)
- **createdAt**: Fecha de creación
- **updatedAt**: Fecha de última actualización

### Endpoints
```
POST   /sales                      # Crear venta
GET    /sales                      # Listar ventas
GET    /sales?userId=<id>          # Listar ventas de un usuario
GET    /sales/report/:userId       # Obtener reporte de ventas
GET    /sales/:id                  # Obtener venta por ID
PATCH  /sales/:id                  # Actualizar estado de venta
DELETE /sales/:id                  # Eliminar venta (restaura inventario)
```

### Características
- ✅ Cálculo automático del total
- ✅ Descuento de inventario al crear venta
- ✅ Validación de stock disponible
- ✅ Restauración de inventario al cancelar
- ✅ Reportes de ventas por usuario
- ✅ Estadísticas por método de pago

## 🗄️ Base de Datos

### Configuración PostgreSQL
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cuenta_helados
```

### Características
- ✅ Sincronización automática de esquema (synchronize: true)
- ✅ Relaciones con cascada
- ✅ Índices en claves únicas
- ✅ Campos de auditoria (createdAt, updatedAt)

## 🚀 Instalación y Uso

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12
- npm o yarn

### Instalación
```bash
# Clonar o entrar al directorio
cd cuenta_back

# Instalar dependencias
npm install

# Crear archivo .env con los valores de ejemplo
cp .env.example .env
```

### Desarrollo
```bash
# Iniciar en modo watch
npm run start:dev

# La aplicación estará disponible en http://localhost:3000
```

### Producción
```bash
# Compilar
npm run build

# Ejecutar
npm run start:prod
```

## 🔄 Flujo de Negocio - Crear Venta

```
1. Cliente realiza compra de productos
   ↓
2. Se envía request POST /sales con items
   ↓
3. Validar usuario existe
   ↓
4. Para cada item:
   - Validar producto existe y pertenece al usuario
   - Validar inventario suficiente
   - Calcular subtotal (cantidad × precio_unitario)
   ↓
5. Sumar todos los subtotales → total_venta
   ↓
6. Guardar venta con estado: PENDIENTE
   ↓
7. Guardar detalles de venta
   ↓
8. Descontar inventario de cada producto
   ↓
9. Retornar venta completa con detalles
```

## 📦 Payload Ejemplos

### Crear Usuario
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@heladeria.com",
  "password": "miPassword123"
}
```

### Crear Producto
```json
{
  "nombre": "Helado de Vainilla",
  "precio": 5.99,
  "codigo": "SKU-001",
  "inventario": 100,
  "userId": "uuid-del-usuario"
}
```

### Crear Venta
```json
{
  "userId": "uuid-del-usuario",
  "fecha": "2024-01-17T10:30:00Z",
  "metodo_pago": "efectivo",
  "items": [
    {
      "productId": "uuid-producto-1",
      "cantidad": 2
    },
    {
      "productId": "uuid-producto-2",
      "cantidad": 1
    }
  ]
}
```

### Actualizar Estado de Venta
```json
{
  "estado": "pagada",
  "metodo_pago": "tarjeta"
}
```

## 🛡️ Validaciones

### Users
- Nombre: string requerido
- Email: formato email válido, único en BD
- Password: mínimo 6 caracteres

### Products
- Nombre: string requerido
- Precio: número positivo con max 2 decimales
- Código: string requerido (único por usuario)
- Inventario: número >= 0

### Sales
- UserId: UUID válido y usuario debe existir
- Items: mínimo 1 item
- Cantidad: número > 0
- Validación de inventario antes de crear

## 📊 Reporte de Ventas

Endpoint: `GET /sales/report/:userId`

Retorna:
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
    }
  }
}
```

## 🔐 Preparación para JWT (Futuro)

La estructura está preparada para agregar autenticación JWT:
- `.env.example` incluye variables JWT_SECRET y JWT_EXPIRATION
- Services están preparados para estrategias de auth
- Controladores pueden decorarse con `@UseGuards(AuthGuard('jwt'))`

## 📝 Próximas Mejoras

- [ ] Implementar autenticación JWT
- [ ] Agregar guards para autorización
- [ ] Crear migraciones automáticas
- [ ] Agregar logs structured
- [ ] Implementar rate limiting
- [ ] Documentación OpenAPI/Swagger
- [ ] Tests unitarios y e2e
- [ ] Docker y docker-compose

## 📄 Licencia

UNLICENSED
