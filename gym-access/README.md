# Frontend de Acceso - Sistema de Gestión de Gimnasio

Aplicación web desarrollada con React para el panel de control de acceso del sistema de gestión de gimnasio.

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
├── components/   # Componentes reutilizables
├── styles/       # Estilos
└── types/        # Tipos TypeScript
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

- Verificación de acceso mediante DNI
- Visualización de estado de inscripción
- Resumen de cuenta del usuario
- Mensajes de error claros y concisos
- Interfaz simple y directa
- Diseño adaptado al público del gimnasio

## 🎨 UI/UX

- Diseño minimalista y accesible
- Tema personalizado con Material UI
- Feedback visual inmediato
- Mensajes claros y concisos
- Diseño adaptado a diferentes tamaños de pantalla

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api
```