import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/todos';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable().pipe(
    shareReplay(1)
  );

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  // Cargar todas las tareas desde la API
  loadTasks(): void {
    this.http.get<Task[]>(this.API_URL).subscribe({
      next: (tasks) => {
        // Limitamos a 20 tareas para mejor rendimiento
        // Establecer todas como pendientes (completed: false)
        const processedTasks = tasks.slice(0, 20).map(task => ({
          ...task,
          completed: false,
          lastModified: new Date()
        }));
        this.tasksSubject.next(processedTasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasksSubject.next([]);
      },
    });
  }

  // Obtener todas las tareas
  getAllTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // Crear una nueva tarea
  createTask(taskData: CreateTaskDto): Observable<Task> {
    // Validar que el título no esté vacío
    const title = taskData.title?.trim();
    if (!title || title.length < 3) {
      throw new Error('Task title must be at least 3 characters long');
    }

    const currentTasks = this.tasksSubject.value;
    const newId = Math.max(...currentTasks.map((t) => t.id), 0) + 1;
    
    const newTask: Task = {
      userId: 1,
      id: newId,
      title: title,
      completed: taskData.completed || false,
      lastModified: new Date(),
    };

    // Agregar la nueva tarea al principio del array
    this.tasksSubject.next([newTask, ...currentTasks]);

    // Llamar a la API (sin esperar respuesta para optimistic update)
    return this.http.post<Task>(this.API_URL, newTask).pipe(
      map((response) => newTask),
      catchError((error) => {
        console.error('Error creating task:', error);
        return of(newTask);
      })
    );
  }

  // Actualizar una tarea existente
  updateTask(id: number, taskData: UpdateTaskDto): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    
    // Verificar que la tarea existe
    const existingTaskIndex = currentTasks.findIndex((t) => t.id === id);
    if (existingTaskIndex === -1) {
      throw new Error('Task not found');
    }

    // Crear la tarea actualizada
    const updatedTask = {
      ...currentTasks[existingTaskIndex],
      ...taskData,
      lastModified: new Date(),
    };

    // Actualizar el array: reemplazar solo la tarea específica
    const updatedTasks = currentTasks.map((task) =>
      task.id === id ? updatedTask : task
    );

    // Emitir el array actualizado
    this.tasksSubject.next(updatedTasks);

    // Si hay error en la API, no revertir (optimistic update)
    return this.http.put<Task>(`${this.API_URL}/${id}`, updatedTask).pipe(
      map((response) => updatedTask),
      catchError((error) => {
        console.error('Error updating task:', error);
        return of(updatedTask);
      })
    );
  }

  // Eliminar una tarea
  deleteTask(id: number): Observable<void> {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter((t) => t.id !== id);
    this.tasksSubject.next(filteredTasks);

    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // Cambiar el estado de completado de una tarea
  toggleTaskComplete(id: number): Observable<Task> {
    const currentTasks = this.tasksSubject.value;
    const task = currentTasks.find((t) => t.id === id);

    if (task) {
      return this.updateTask(id, { completed: !task.completed });
    }

    throw new Error('Task not found');
  }
}
