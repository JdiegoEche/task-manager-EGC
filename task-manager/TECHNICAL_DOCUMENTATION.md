# Documentación Técnica - Task Manager

## Arquitectura General

El Task Manager sigue la arquitectura recomendada de Angular con una clara separación de responsabilidades:

```
APP (Raíz)
├── CORE (Servicios y Modelos)
│   ├── Models: Definición de interfaces TypeScript
│   └── Services: Lógica de negocio y consumo de API
│
├── FEATURES (Módulos de Funcionalidad)
│   └── Tasks: Componentes relacionados con tareas
│       ├── TaskListComponent: Orquestador principal
│       ├── TaskFormComponent: Entrada de datos
│       └── TaskItemComponent: Presentación unitaria
│
└── SHARED (Componentes Compartidos)
    └── (Disponible para componentes futuros)
```

## Componentes

### TaskListComponent (Orquestador)
**Ubicación:** `src/app/features/tasks/task-list/task-list.component.ts`

**Responsabilidades:**
- Gestiona el estado del filtro actual
- Orquesta la comunicación entre componentes
- Proporciona los datos filtrados a childcomponents
- Maneja las acciones del usuario (crear, editar, eliminar)

**Inputs:** Ninguno (standalone)
**Outputs:** Ninguno (standalone)

**Properties clave:**
- `filteredTasks$: Observable<Task[]>` - Tareas filtradas en tiempo real
- `currentFilter: FilterType` - Filtro activo ('all', 'pending', 'completed')
- `editingTask: Task | null` - Tarea actualmente en edición

**Métodos clave:**
- `setFilter(filter)` - Cambia el filtro activo
- `onFormSubmit(data)` - Crea o actualiza una tarea
- `onEditTask(task)` - Prepara una tarea para edición
- `onDeleteTask(id)` - Elimina una tarea con confirmación
- `onToggleComplete(id)` - Cambia el estado de completado

### TaskFormComponent (Formulario)
**Ubicación:** `src/app/features/tasks/task-form/task-form.component.ts`

**Responsabilidades:**
- Gestiona el formulario reactivo
- Valida los datos de entrada
- Emite eventos de envío y cancelación

**Inputs:**
- `@Input() task: Task | null` - Tarea a editar (null para crear)

**Outputs:**
- `@Output() submit` - Emite datos cuando el formulario es válido
- `@Output() cancel` - Emite cuando se cancela la edición

**FormControl:**
- `title` - Validadores: required, minLength(3)
- `completed` - Boolean, por defecto false

**Validaciones:**
- El título es obligatorio
- El título debe tener al menos 3 caracteres
- Los errores se muestran en tiempo real

### TaskItemComponent (Presentación)
**Ubicación:** `src/app/features/tasks/task-item/task-item.component.ts`

**Responsabilidades:**
- Presentar una tarea individual
- Capturar acciones del usuario

**Inputs:**
- `@Input() task: Task` - Tarea a mostrar

**Outputs:**
- `@Output() toggleComplete: EventEmitter<number>` - ID de tarea
- `@Output() edit: EventEmitter<Task>` - Tarea completa
- `@Output() delete: EventEmitter<number>` - ID de tarea

**Métodos:**
- `onToggleComplete()` - Emite toggle event
- `onEdit()` - Emite tarea para edición
- `onDelete()` - Emite ID para eliminación

## Servicio

### TaskService
**Ubicación:** `src/app/core/services/task.service.ts`

**Responsabilidades:**
- Comunicación con la API
- Gestión del estado local de tareas
- Operaciones CRUD

**Properties:**
- `tasks$: Observable<Task[]>` - Observable de tareas (BehaviorSubject)
- `API_URL = 'https://jsonplaceholder.typicode.com/todos'`

**Métodos Públicos:**

#### `loadTasks(): void`
Carga las primeras 20 tareas desde la API al inicializar el servicio.

#### `getAllTasks(): Observable<Task[]>`
Retorna las tareas actuales como Observable.

#### `createTask(taskData: CreateTaskDto): Observable<Task>`
- Crea una nueva tarea localmente primero (optimistic update)
- Realiza el POST a la API
- Retorna la tarea creada

#### `updateTask(id: number, taskData: UpdateTaskDto): Observable<Task>`
- Actualiza el estado local inmediatamente
- Realiza el PUT a la API
- Retorna la tarea actualizada

#### `deleteTask(id: number): Observable<void>`
- Elimina de forma optimista del estado local
- Realiza el DELETE a la API

#### `toggleTaskComplete(id: number): Observable<Task>`
- Alterna el estado de completado
- Llama a `updateTask()` internamente

**Estrategia de Actualización:**
El servicio utiliza **optimistic updates**, lo que significa:
1. La UI se actualiza inmediatamente con el cambio
2. Se realiza la llamada a la API en segundo plano
3. Si hay error, la UI se revierte (manejo de errores)

## Modelos (TypeScript)

### Task
```typescript
interface Task {
  userId: number;    // ID del usuario propietario
  id: number;        // ID único de la tarea
  title: string;     // Título de la tarea
  completed: boolean;// Estado de completado
}
```

### CreateTaskDto
```typescript
interface CreateTaskDto {
  title: string;           // Título (requerido)
  completed?: boolean;     // Estado (opcional, default false)
}
```

### UpdateTaskDto
```typescript
interface UpdateTaskDto {
  title?: string;      // Puede actualizar título
  completed?: boolean; // Puede actualizar estado
}
```

## Flujos de Datos (RxJS)

### Flujo de Filtrado
```
TaskService.tasks$ 
  → map(applyFilter) 
  → takeUntil(destroy$) 
  → AsyncPipe en template
```

### Flujo de Creación
```
User submits Form
  → TaskListComponent.onFormSubmit()
  → TaskService.createTask()
  → BehaviorSubject emite nuevo estado
  → filteredTasks$ se actualiza
  → Template re-renderiza (OnPush detection)
```

### Flujo de Edición
```
User clicks Edit
  → TaskListComponent.onEditTask()
  → editingTask = selected task
  → TaskFormComponent recibe task via Input
  → User modifica y submits
  → TaskListComponent.onFormSubmit()
  → TaskService.updateTask()
  → Ciclo similar a creación
```

## Gestión de Memoria

El componente implementa el patrón de `destroy$` para evitar memory leaks:

```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.filteredTasks$ = this.taskService.getAllTasks().pipe(
    map(...),
    takeUntil(this.destroy$)  // Desuscribe automáticamente
  );
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Estrategias de Performance

1. **OnPush Change Detection**: Todos los componentes
   ```typescript
   changeDetection: ChangeDetectionStrategy.OnPush
   ```
   Solo detectan cambios cuando:
   - Inputs cambian
   - Se emite algo en @Output
   - Se ejecuta código async

2. **Standalone Components**: No requieren NgModule
   - Menor bundle size
   - Mejor tree-shaking

3. **Async Pipe**: En templates para Observables
   - Auto-desuscripción en ngOnDestroy
   - Aprovecha OnPush para re-renders

4. **Filtrado en el Servicio**: No en el componente
   - Centralizar lógica de datos
   - Reutilizable para otros componentes

## Estilos

Todos los componentes incluyen estilos encapsulados usando `styles` property.

### Principales características de CSS:
- Flexbox para layouts
- Media queries para responsividad
- Variables de color consistentes
- Transiciones suaves
- Accesibilidad (aria-labels)

## API Endpoints

**Base URL:** `https://jsonplaceholder.typicode.com`

- `GET /todos` - Obtiene todas las tareas
- `GET /todos/:id` - Obtiene tarea específica
- `POST /todos` - Crea nueva tarea
- `PUT /todos/:id` - Actualiza tarea
- `DELETE /todos/:id` - Elimina tarea

**Nota:** JSONPlaceholder es una API demo que no persiste datos reales.

## Testing (Estructura recomendada)

Para agregar tests:

1. **Servicios:**
   ```
   src/app/core/services/task.service.spec.ts
   ```
   Mockear HttpClient

2. **Componentes:**
   ```
   src/app/features/tasks/task-list/task-list.component.spec.ts
   ```
   Usar MockTaskService

3. **Integration:**
   - Probar el flujo completo de creación-edición-eliminación

## Extensión Futura

### Mejoras posibles:
1. **Persistencia Real**: Cambiar a backend real
2. **Paginación**: Cargar más tareas bajo demanda
3. **Búsqueda**: Filtro text para tareas
4. **Categorías**: Agrupar tareas por categoría
5. **Prioridades**: Niveles de urgencia
6. **Recordatorios**: Notificaciones programadas
7. **Sincronización**: Sincronizar entre dispositivos

## Debugging

### Chrome DevTools:
1. Abre DevTools (F12)
2. Tab "Sources" para breakpoints
3. Tab "Network" para ver llamadas a API
4. Tab "Console" para logs

### Redux DevTools (opcional):
Si se implementara NgRx:
```bash
npm install @ngrx/store-devtools
```

## Variables de Entorno

En `environment.ts` y `environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://jsonplaceholder.typicode.com'
};
```

## Contribuciones

Cuando contribuyas:
1. Mantén el principio de separación de responsabilidades
2. Sigue el patrón de componentes standalone
3. Usa tipado fuerte (sin `any`)
4. Implementa OnPush change detection
5. Documenta métodos públicos
