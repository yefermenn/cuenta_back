# 🚀 Guía de Inicio Rápido

## Antes de Comenzar

### Requisitos Previos
- **Node.js** 16+ instalado
- **PostgreSQL** 12+ instalado y corriendo
- **npm** o **yarn**

## Pasos para Ejecutar

### 1. Configurar PostgreSQL

**Opción A: Si tienes PostgreSQL instalado localmente**

```bash
# En Windows (abre una ventana de PowerShell)
# PostgreSQL generalmente se instala como servicio y corre automáticamente

# En Linux/Mac
sudo systemctl start postgresql
```

**Opción B: Crear base de datos manualmente**

```bash
# Conectar a PostgreSQL
psql -U postgres

# En la consola de psql:
CREATE DATABASE cuenta_helados;
\q
```

### 2. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus credenciales (si tienes usuario/contraseña diferente)
# Valores por defecto:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=postgres
# DB_DATABASE=cuenta_helados
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar en Modo Desarrollo

```bash
npm run start:dev
```

Deberías ver algo como:
```
✅ Servidor ejecutándose en puerto 3000
```

## ✅ Verificar que Funciona

Una vez que el servidor está corriendo, prueba un endpoint:

```bash
# En otra terminal, crea un usuario:
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Test",
    "email": "juan@test.com",
    "password": "password123"
  }'
```

Deberías recibir un response con el usuario creado.

## 📝 Flujo Completo de Ejemplo

### 1. Crear un Usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Heladería",
    "email": "admin@miheladeria.com",
    "password": "MiPassword123"
  }'
```

**Guarda el ID del usuario** que retorna (ej: `550e8400-e29b-41d4-a716-446655440000`)

### 2. Crear Productos
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Helado Vainilla",
    "precio": 5.99,
    "codigo": "VAL-001",
    "inventario": 100,
    "userId": "TU_USER_ID_AQUI"
  }'
```

**Guarda el ID del producto** (ej: `660e8400-e29b-41d4-a716-446655440000`)

### 3. Crear una Venta
```bash
curl -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "TU_USER_ID_AQUI",
    "metodo_pago": "efectivo",
    "items": [
      {
        "productId": "TU_PRODUCT_ID_AQUI",
        "cantidad": 2
      }
    ]
  }'
```

### 4. Listar Productos (con inventario actualizado)
```bash
curl http://localhost:3000/products?userId=TU_USER_ID_AQUI
```

Verás que el inventario bajó de 100 a 98 (se vendieron 2 unidades).

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica que las credenciales en `.env` son correctas
- Verifica que la base de datos `cuenta_helados` existe

### Error: "Port 3000 is already in use"
```bash
# Opción 1: Cambiar puerto en .env
# PORT=3001

# Opción 2: Matar proceso en puerto 3000 (Windows PowerShell)
# Get-Process -Name "node" | Stop-Process
```

### Error de Validación (422)
- Verifica que los datos cumplan con los validadores
- Email debe ser formato email válido
- Password mínimo 6 caracteres
- Precios deben ser números positivos
- userId, productId deben ser UUIDs válidos

### Error "email must be unique"
- El email ya está registrado
- Usa otro email

## 🔧 Compilación para Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar compilado
npm run start:prod

# Nota: En producción, asegurate de:
# - Cambiar NODE_ENV a "production"
# - Usar credenciales seguras en .env
# - Synchronize debe ser false
```

## 📊 Verificar Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres -d cuenta_helados

# Ver tablas creadas
\dt

# Ver contenido de usuarios
SELECT * FROM users;

# Ver contenido de productos
SELECT * FROM products;

# Ver contenido de ventas
SELECT * FROM sales;

# Salir
\q
```

## 🆘 Necesitas Ayuda?

- Revisa [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) para entender la arquitectura
- Revisa [API_REFERENCE.md](./API_REFERENCE.md) para detalles de cada endpoint
- Verifica los logs en la consola para más detalles de errores

## 🎉 ¡Listo!

Ahora tienes un backend completamente funcional para tu heladería. Puedes:

✅ Crear usuarios (dueños de heladería)  
✅ Gestionar productos con inventario  
✅ Registrar ventas y descontar stock  
✅ Generar reportes  
✅ Validar datos de entrada  

¡Diviértete construyendo! 🍦
