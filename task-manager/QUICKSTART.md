# QUICK START - Task Manager

## Inicio Rápido en 3 Pasos

### 1️⃣ Abre el proyecto en VS Code
```bash
cd C:\Users\Juan\Desktop\programar\task-manager\task-manager
code .
```

### 2️⃣ Instala dependencias (si es la primera vez)
```bash
npm install
```

### 3️⃣ Inicia el servidor
```bash
npm start
```

El navegador se abrirá automáticamente en http://localhost:4200

---

## Uso Básico

### ➕ Crear una Tarea
1. Escribe el título en el formulario (mínimo 3 caracteres)
2. Click en "Crear tarea"

### ✏️ Editar una Tarea
1. Click en "Editar" en la tarea
2. Modifica los datos en el formulario
3. Click en "Actualizar tarea"

### 🗑️ Eliminar una Tarea
1. Click en "Eliminar"
2. Confirma en el diálogo

### ✅ Marcar como Completada
1. Click en el checkbox de la tarea

### 🔍 Filtrar Tareas
- **Todas**: Ver todas las tareas
- **Pendientes**: Ver solo tareas sin completar
- **Completadas**: Ver solo tareas completadas

---

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
ng build --configuration production

# Ejecutar tests
ng test

# Build para deploy
npm run build
```

---

## La Aplicación Incluye

✅ 20 tareas de ejemplo cargadas desde una API pública
✅ Formulario con validaciones
✅ Tres filtros (Todas, Pendientes, Completadas)
✅ Edición y eliminación de tareas
✅ Interfaz responsiva (funciona en móvil)

---

## Documentación Disponible

- **README.md** - Información general y configuración
- **USAGE_GUIDE.md** - Guía completa de características
- **TECHNICAL_DOCUMENTATION.md** - Detalles para desarrolladores
- **PROJECT_SUMMARY.md** - Resumen de implementación

---

## Problemas Comunes

**Las tareas no aparecen**
- Recarga la página (F5)
- Verifica tu conexión a Internet

**El formulario dice "error"**
- Asegúrate que el título tenga al menos 3 caracteres

**¿Mis datos se guardan?**
- Los datos se guardan en memoria mientras la app está abierta
- Al recargar, se recargan desde la API

---

## Siguiente: Personalizar

Después de familiarizarte, puedes:
1. Cambiar el estilo CSS en los componentes
2. Agregar nuevos filtros
3. Cambiar la API a tu propio backend
4. Agregar más funcionalidades

¡Diviértete! 🚀
