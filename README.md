# 🍦 Backend Heladería - NestJS

Estructura completa y modular de un backend para un sistema de gestión de ventas de heladería, construido con **NestJS**, **PostgreSQL** y **TypeORM**.

## 📋 Características Principales

✅ **Autenticación y Usuarios** - Sistema de usuarios con contraseñas encriptadas  
✅ **Gestión de Productos** - Control de inventario con SKU único por usuario  
✅ **Módulo de Ventas** - Transacciones completas con detalles de venta  
✅ **Automatización** - Cálculo automático de totales y descuento de inventario  
✅ **Base de Datos PostgreSQL** - Con TypeORM y sincronización automática de esquema  
✅ **Validación DTOs** - Validación completa de datos de entrada  
✅ **Reportes** - Estadísticas de ventas por usuario y método de pago  
✅ **Arquitectura Modular** - Estructura escalable y mantenible  

## 🏗️ Estructura del Proyecto

```
src/
├── config/
│   └── database.config.ts
├── modules/
│   ├── users/          # Módulo de usuarios
│   ├── products/       # Módulo de productos
│   └── sales/          # Módulo de ventas
├── app.module.ts
├── main.ts
└── ...
```

Cada módulo contiene:
- **entity**: Definición de la entidad de base de datos
- **controller**: Endpoints HTTP
- **service**: Lógica de negocio
- **dto**: Data Transfer Objects para validación

## 🚀 Comenzando

### Prerequisitos

- **Node.js** >= 16
- **npm** o **yarn**
- **PostgreSQL** >= 12

### Instalación

1. **Clonar/entrar al directorio:**
```bash
cd cuenta_back
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar base de datos:**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
```

4. **Asegurar que PostgreSQL esté corriendo:**
```bash
# En Linux/Mac
sudo systemctl start postgresql

# En Windows (si está instalado como servicio)
# El servicio debería estar corriendo automáticamente
```

### Desarrollo

Iniciar el servidor en modo watch:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

Con `synchronize: true`, la base de datos se actualizará automáticamente con los cambios en las entidades.

### Compilación y Producción

```bash
# Compilar
npm run build

# Ejecutar en producción
npm run start:prod
```

## 📚 Documentación

- **[BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)** - Documentación completa de la arquitectura
- **[API_REFERENCE.md](./API_REFERENCE.md)** - Referencia detallada de todos los endpoints

## 🔐 Módulos

### 👥 Usuarios (Users)
- Crear usuarios con email único
- Encriptación de contraseñas con bcrypt
- Gestión de perfil de usuario

```bash
POST   /users           # Crear usuario
GET    /users           # Listar usuarios
GET    /users/:id       # Obtener usuario
PATCH  /users/:id       # Actualizar usuario
DELETE /users/:id       # Eliminar usuario
```

### 🍦 Productos (Products)
- Gestión de inventario
- SKU único por usuario
- Control de stock

```bash
POST   /products             # Crear producto
GET    /products             # Listar productos
GET    /products?userId=<id> # Productos de usuario
GET    /products/:id         # Obtener producto
PATCH  /products/:id         # Actualizar producto
DELETE /products/:id         # Eliminar producto
```

### 🧾 Ventas (Sales)
- Transacciones completas
- Detalles de cada venta
- Estados de pago
- Reportes de ventas

```bash
POST   /sales                    # Crear venta
GET    /sales                    # Listar ventas
GET    /sales?userId=<id>        # Ventas de usuario
GET    /sales/report/:userId     # Reporte de ventas
GET    /sales/:id                # Obtener venta
PATCH  /sales/:id                # Actualizar venta
DELETE /sales/:id                # Eliminar venta
```

## 🔄 Flujo de Negocio - Crear Venta

Cuando se crea una venta:

1. ✅ Valida que el usuario exista
2. ✅ Valida que todos los productos pertenezcan al usuario
3. ✅ Valida inventario suficiente para cada producto
4. ✅ Calcula automáticamente el total
5. ✅ Guarda la venta y sus detalles
6. ✅ Descuenta el inventario de los productos
7. ✅ Retorna la venta completa con detalles

**Ejemplos y más detalles en [API_REFERENCE.md](./API_REFERENCE.md)**

## 📦 Ejemplo de Payload

### Crear Venta
```json
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

## 🗄️ Base de Datos

### Tablas Principales

- **users** - Usuarios (dueños de heladería)
- **products** - Productos (helados)
- **sales** - Ventas/Transacciones
- **sale_details** - Detalles de cada venta

### Configuración PostgreSQL

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cuenta_helados
```

### Características

- ✅ UUIDs como claves primarias
- ✅ Índices en campos únicos
- ✅ Relaciones con cascada
- ✅ Campos de auditoría (createdAt, updatedAt)
- ✅ Sincronización automática en desarrollo

## 🛡️ Validaciones

Todos los endpoints incluyen validación automática:

- **Emails**: Formato válido y único
- **Precios**: Decimales con máximo 2 lugares
- **Cantidades**: Números positivos
- **Inventario**: Validación antes de vender
- **UUIDs**: Formato UUID válido

## 📊 Reportes

Obtener estadísticas de ventas:

```bash
GET /sales/report/{userId}
```

Retorna:
- Total de ventas
- Ventas pagadas/canceladas
- Monto total y pagado
- Desglose por método de pago

## 🔮 Próximas Funcionalidades

- [ ] Autenticación JWT
- [ ] Guards y autorización
- [ ] Swagger/OpenAPI
- [ ] Tests unitarios y E2E
- [ ] Caché con Redis
- [ ] Logs structured
- [ ] Docker/Docker Compose
- [ ] CI/CD Pipeline

## 📝 Scripts Disponibles

```bash
npm run start       # Iniciar servidor
npm run start:dev   # Iniciar en modo watch
npm run start:debug # Iniciar con debug
npm run build       # Compilar
npm run lint        # Ejecutar linter
npm run test        # Ejecutar tests
npm run test:e2e    # Tests E2E
```

## 🤝 Contribuyendo

Este es un proyecto de ejemplo. Siéntete libre de adaptarlo a tus necesidades.

## 📄 Licencia

UNLICENSED

---

**Última actualización:** Enero 2024  
**Versión:** 1.0.0
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
