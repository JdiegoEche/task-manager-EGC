# Documentación Técnica - Task Manager

## Arquitectura

```
TaskListComponent (orquestador)
├── TaskFormComponent (formulario con Reactive Forms)
└── TaskItemComponent (presentación de una tarea)

TaskService (estado central con BehaviorSubject + API HTTP)
```

## Componentes

### TaskListComponent
Componente padre. Gestiona filtros, coordina creación/edición/eliminación llamando a `TaskService`, y pasa datos a los componentes hijos.

### TaskFormComponent
Formulario reactivo con validaciones (`required`, `minLength(3)`). Recibe una tarea vía `@Input()` para modo edición, emite los datos con `@Output() submit`.

### TaskItemComponent
Componente de presentación. Recibe una `Task` por `@Input()` y emite eventos: `toggleComplete`, `edit`, `delete`.

## TaskService

Maneja el estado con un `BehaviorSubject<Task[]>` y hace llamadas HTTP a JSONPlaceholder. Usa **optimistic updates**: actualiza la UI primero y luego sincroniza con la API.

| Método | Descripción |
|---|---|
| `getAllTasks()` | Retorna `Observable<Task[]>` |
| `createTask(data)` | Crea tarea local + POST a API |
| `updateTask(id, data)` | Actualiza local + PUT a API |
| `deleteTask(id)` | Elimina local + DELETE a API |
| `toggleTaskComplete(id)` | Alterna `completed` vía `updateTask()` |

## Modelos

```typescript
interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  lastModified: Date;
}

interface CreateTaskDto {
  title: string;
  completed?: boolean;
}

interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}
```

## Flujo de datos

```
Usuario interactúa → TaskItemComponent emite evento → TaskListComponent maneja →
TaskService actualiza BehaviorSubject → Observable emite → AsyncPipe re-renderiza
```

## Notas técnicas

- Todos los componentes usan `ChangeDetectionStrategy.OnPush`
- Suscripciones manejadas con patrón `takeUntil(destroy$)` para evitar memory leaks
- Componentes standalone (sin NgModule)
