# Task Manager

Aplicación web de gestión de tareas construida con Angular 21. Permite crear, editar, eliminar y filtrar tareas, consumiendo datos de [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos).

## Instalación

```bash
cd task-manager/task-manager
npm install
```

## Ejecución

```bash
npm start
```

Se abre en `http://localhost:4200`

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/task.model.ts        # Interfaces: Task, CreateTaskDto, UpdateTaskDto
│   └── services/task.service.ts    # Servicio CRUD + estado con BehaviorSubject
├── features/tasks/
│   ├── task-list/                  # Componente principal (orquestador)
│   ├── task-form/                  # Formulario de crear/editar
│   └── task-item/                  # Tarjeta individual de tarea
└── shared/
```

## Funcionalidades

- Listar, crear, editar y eliminar tareas
- Marcar tareas como completadas
- Filtros: Todas / Pendientes / Completadas
- Validaciones en formulario (título obligatorio, mínimo 3 caracteres)
- Interfaz responsiva

## Tecnologías

- Angular 21 (Standalone Components, OnPush)
- TypeScript
- RxJS (BehaviorSubject, Observables)
- Reactive Forms
- HttpClient
