# Task Manager - Gestor de Tareas

Una aplicación web moderna de gestión de tareas construida con **Angular 17+**, que permite crear, editar, eliminar y filtrar tareas consumiendo datos de una API pública.

## Características

✅ **Listar tareas** - Obtiene tareas desde la API JSONPlaceholder
✅ **Crear tareas** - Formulario con validaciones (título obligatorio, mínimo 3 caracteres)
✅ **Editar tareas** - Modificar título y estado de completado
✅ **Eliminar tareas** - Remover tareas del listado
✅ **Marcar como completada** - Cambiar estado dinámicamente
✅ **Filtros** - Mostrar todas, pendientes o completadas
✅ **Interfaz responsiva** - Adaptable a dispositivos móviles

## Requisitos Técnicos

- **Angular 17+**
- **TypeScript** con tipado fuerte (sin `any`)
- **RxJS** para manejo de Observables
- **Reactive Forms** con validaciones
- **HttpClient** para consumo de API
- **Componentes Standalone**

## Estructura del Proyecto

```
src/app/
├── core/                          # Servicios y modelos de dominio
│   ├── models/
│   │   └── task.model.ts         # Interfaces Task, CreateTaskDto, UpdateTaskDto
│   └── services/
│       └── task.service.ts       # Servicio de tareas (API y estado)
├── features/                      # Características específicas de la aplicación
│   └── tasks/
│       ├── task-list/            # Componente principal
│       │   └── task-list.component.ts
│       ├── task-form/            # Formulario para crear/editar
│       │   └── task-form.component.ts
│       └── task-item/            # Componente para cada tarea
│           └── task-item.component.ts
└── shared/                        # Componentes compartidos (preparado para futuros)
```

## Instalación

1. **Navegar al proyecto:**
   ```bash
   cd task-manager/task-manager
   ```

2. **Instalar dependencias (si no lo has hecho):**
   ```bash
   npm install
   ```

## Ejecutar la Aplicación

### Modo Desarrollo
```bash
npm start
# o
ng serve --open
```

La aplicación se abrirá automáticamente en `http://localhost:4200/`

### Modo Producción
```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/task-manager/`

## Compilar el Proyecto

```bash
ng build
```

## Ejecutar Pruebas

```bash
ng test
```

## APIs Utilizadas

- **GET /todos** - Obtiene todas las tareas
- **POST /todos** - Crea una nueva tarea
- **PUT /todos/:id** - Actualiza una tarea
- **DELETE /todos/:id** - Elimina una tarea

**URL Base:** `https://jsonplaceholder.typicode.com`

## Características de la Interfaz

### Formulario de Tareas
- Campo de título obligatorio con validación de longitud mínima (3 caracteres)
- Checkbox para marcar como completada
- Botones para crear o actualizar tareas
- Validaciones visibles en tiempo real

### Listado de Tareas
- Visualización de ID, título y estado
- Checkbox para cambiar estado de completado
- Botones para editar y eliminar
- Indicación visual de tareas completadas

### Filtros
- **Todas**: Muestra todas las tareas
- **Pendientes**: Muestra solo tareas no completadas
- **Completadas**: Muestra solo tareas completadas

## Arquitectura y Mejores Prácticas

- **Change Detection Strategy**: OnPush para mejor rendimiento
- **Componentes Standalone**: Aprovechan las características de Angular moderno
- **RxJS Operators**: Uso de `map`, `takeUntil` para manejo de datos
- **Unsubscribe Management**: Implementación del patrón de `destroy$` para evitar memory leaks
- **Tipado Fuerte**: Interfaces TypeScript para todas las operaciones
- **Separación de Responsabilidades**: Core, Features y Shared adecuadamente definidas

## Notas de Desarrollo

- El servicio de tareas maneja un estado local con `BehaviorSubject`
- Las operaciones contra la API se realizan de forma optimista (actualización local inmediata)
- Confirmación de eliminación antes de proceder
- Validaciones de formulario con feedback visual

## Navegadores Soportados

- Chrome/Chromium (últimas versiones)
- Firefox (últimas versiones)
- Safari (últimas versiones)
- Edge (últimas versiones)

## Proyecto Generado con

- Angular CLI 21.2.1
- Angular 21+
- TypeScript
- RxJS

## Licencia

MIT
