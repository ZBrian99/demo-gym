# Backend - Sistema de Gestión de Gimnasio

API REST desarrollada con NestJS para el sistema de gestión de gimnasio.

## 🛠️ Tecnologías

- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT & Bcrypt
- Socket.IO
- Day.js

## 📁 Estructura del Proyecto

```
src/
├── access-control/  # Control de acceso y puertas
├── auth/           # Autenticación y autorización
├── common/         # Utilidades y decoradores comunes
├── enrollments/    # Gestión de inscripciones
├── payments/       # Gestión de pagos
├── prisma/         # Configuración de Prisma
├── seed/           # Datos iniciales
└── users/          # Gestión de usuarios
```

## 🚀 Instalación

1. Instala las dependencias
```bash
npm install
```

2. Configura las variables de entorno
```bash
cp .env.example .env
```

3. Ejecuta las migraciones de Prisma
```bash
npx prisma migrate dev
```

4. Inicia el servidor de desarrollo
```bash
npm run start:dev
```

## 📝 API Endpoints

### Autenticación
- `POST /auth/login` - Inicio de sesión

### Usuarios
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario
- `GET /users/check/:dni` - Verificar DNI

### Inscripciones
- `GET /enrollments` - Listar inscripciones
- `POST /enrollments` - Crear inscripción
- `GET /enrollments/:id` - Obtener inscripción
- `PUT /enrollments/:id` - Actualizar inscripción
- `DELETE /enrollments/:id` - Eliminar inscripción

### Control de Acceso
- `POST /access-control/validate` - Validar acceso por DNI
- `POST /access-control/register` - Registrar acceso
- `GET /access-control/user/:userId` - Historial de acceso de usuario
- `GET /access-control` - Listar todos los accesos

### Pagos
- `GET /payments` - Listar pagos
- `POST /payments` - Registrar pago
- `GET /payments/:id` - Obtener pago
- `PUT /payments/:id` - Actualizar pago

## 🔒 Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=4000
JWT_SECRET="tu-secreto-jwt"
JWT_EXPIRATION="2d"
ADMIN_KEY="123456789"
MIN_TIME_BETWEEN_ACCESSES="60"
```

## 📊 Base de Datos

El proyecto utiliza PostgreSQL como base de datos principal. El esquema está definido en el directorio `prisma/`.

Para generar el cliente de Prisma:
```bash
npx prisma generate
```

## 🔌 Socket.IO

El servidor implementa Socket.IO para la comunicación en tiempo real con la placa NodeMCU ESP32:
- Conexión automática al iniciar
- Manejo de eventos de puerta
- Sistema de heartbeat para verificar conexión
- Reconexión automática