# Frontend Administrativo - Sistema de Gestión de Gimnasio

Aplicación web desarrollada con React para el panel de administración del sistema de gestión de gimnasio.

## 🛠️ Tecnologías

- React
- Redux Toolkit & RTK Query
- Material UI
- TypeScript
- Zod & React Hook Form
- Day.js

## 📁 Estructura del Proyecto

```
src/
├── app/          # Estado global (Redux)
├── api/          # Servicios y APIs
├── components/   # Componentes reutilizables
├── features/     # Características principales
├── hooks/        # Custom hooks
├── layouts/      # Layouts de la aplicación
├── routes/       # Rutas de la aplicación
├── styles/       # Estilos
├── types/        # Tipos TypeScript
└── utils/        # Utilidades
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

3. Inicia el servidor de desarrollo
```bash
npm run dev
```

## 📱 Características Principales

- Gestión completa de usuarios
- Panel de control con estadísticas
- Control de inscripciones y pagos
- Registro de accesos
- Comunicación con usuarios vía WhatsApp
- Filtros de búsqueda
- Interfaz adaptada al público del gimnasio

## 🎨 UI/UX

- Diseño responsivo y accesible
- Tema personalizado con Material UI
- Formularios validados con Zod
- Feedback visual para acciones del usuario
- Navegación intuitiva
- Prevención de eliminación accidental

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
```