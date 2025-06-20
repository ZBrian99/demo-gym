# Sistema de Gestión de Gimnasio

Sistema completo para la gestión de usuarios, inscripciones, pagos, control de acceso y automatización de puertas para gimnasio.

Puedes ver una versión funcional del sistema en: [Demo Gym](https://gym-access.up.railway.app/)

## ✨ Características Principales

- Gestión completa de usuarios y sus inscripciones
- Panel de control con estadísticas
- Sistema de control de acceso mediante DNI
- Automatización de puertas con NodeMCU ESP32
- Registro de accesos y pagos
- Comunicación con usuarios vía WhatsApp
- Interfaz responsiva y adaptativa
- Botones físicos de salida para apertura manual de puertas

## 🛠️ Tecnologías Utilizadas

### Frontend
- React
- Redux Toolkit & RTK Query
- Material UI
- TypeScript
- Zod & React Hook Form
- Day.js

### Backend
- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT & Bcrypt
- Socket.IO
- Day.js

### Hardware
- NodeMCU ESP32
- Cerradura Magnética
- Relé
- Step Down (Regulador de voltaje)
- LEDs indicadores
- Botones físicos

## 📁 Estructura del Proyecto

```
├── gym-frontend/     # Panel Administrativo React
├── gym-access/       # Panel de Acceso React
├── gym-backend/      # API NestJS
└── README.md         # Este archivo
```

## 🚀 Inicio Rápido

1. Clona el repositorio
```bash
git clone https://github.com/ZBrian99/demo-gym.git
```

2. Configura el backend
```bash
cd gym-backend
npm install
npm run start:dev
```

3. Configura el frontend administrativo
```bash
cd gym-frontend
npm install
npm run dev
```

4. Configura el frontend de acceso
```bash
cd gym-access
npm install
npm run dev
```

## 📝 Documentación

Para más detalles sobre cada parte del sistema, consulta los READMEs específicos:
- [Documentación del Backend](./gym-backend/README.md)
- [Documentación del Frontend Administrativo](./gym-frontend/README.md)
- [Documentación del Frontend de Acceso](./gym-access/README.md)

## 🔧 Configuración del Hardware

El sistema incluye una placa NodeMCU ESP32 que:
- Se comunica con el servidor mediante Socket.IO
- Controla una cerradura magnética mediante un relé
- Utiliza la fuente de alimentación de la cerradura (con step down)
- Incluye LEDs para indicación de estado
- Tiene botones físicos para apertura manual
- Está programada para dejar la puerta abierta en caso de fallo
- Inicia automáticamente con la PC del gimnasio mediante PM2

## 🔒 Seguridad

- Sistema de autenticación con JWT
- Verificación de DNI para acceso
- Validación de inscripciones activas
- Registro de todos los accesos
- Sistema de respaldo para apertura manual
- Prevención de eliminación accidental de usuarios