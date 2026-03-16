import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Task } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

type FilterType = 'all' | 'pending' | 'completed';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskItemComponent, TaskFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-manager">
      <div class="header">
        <h1>Gestor de Tareas</h1>
        <div class="filter-buttons">
          <button
            *ngFor="let filter of filterOptions"
            (click)="setFilter(filter.value)"
            [class.active]="currentFilter === filter.value"
            class="filter-btn"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="content">
        <div class="form-section">
          <h2>{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
          <app-task-form
            [task]="editingTask"
            (submit)="onFormSubmit($event)"
            (cancel)="onCancelEdit()"
          ></app-task-form>
        </div>

        <div class="task-section">
          <ng-container *ngIf="filteredTasks$ | async as filteredTasks">
            <h2>
              Tareas ({{ filteredTasks.length }})
            </h2>

            <div
              class="no-tasks"
              *ngIf="filteredTasks.length === 0"
            >
              <p>No hay tareas para mostrar</p>
            </div>

          <div class="tasks-list" *ngIf="filteredTasks.length > 0">
              <app-task-item
                *ngFor="let task of filteredTasks; trackBy: trackByTaskId"
                [task]="task"
                (toggleComplete)="onToggleComplete($event)"
                (edit)="onEditTask($event)"
                (delete)="onDeleteTask($event)"
              ></app-task-item>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: `
    .task-manager {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 32px;
    }

    .filter-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 8px 16px;
      border: 2px solid #ddd;
      background-color: white;
      color: #333;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      border-color: #2196f3;
      color: #2196f3;
    }

    .filter-btn.active {
      background-color: #2196f3;
      color: white;
      border-color: #2196f3;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .form-section,
    .task-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
    }

    h2 {
      color: #333;
      font-size: 20px;
      margin-bottom: 20px;
      margin-top: 0;
    }

    .no-tasks {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 900px) {
      .content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .task-manager {
        padding: 10px;
      }

      h1 {
        font-size: 24px;
      }

      .filter-buttons {
        gap: 5px;
      }

      .filter-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  `,
})
export class TaskListComponent implements OnInit, OnDestroy {
  filteredTasks$!: Observable<Task[]>;
  currentFilter: FilterType = 'all';
  editingTask: Task | null = null;

  filterOptions = [
    { label: 'Todas', value: 'all' as FilterType },
    { label: 'Pendientes', value: 'pending' as FilterType },
    { label: 'Completadas', value: 'completed' as FilterType },
  ];

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.updateFilteredTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.updateFilteredTasks();
  }

  private updateFilteredTasks(): void {
    this.filteredTasks$ = this.taskService.getAllTasks().pipe(
      map((tasks) => this.applyFilter(tasks)),
      takeUntil(this.destroy$)
    );
  }

  private applyFilter(tasks: Task[]): Task[] {
    switch (this.currentFilter) {
      case 'pending':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'all':
      default:
        return tasks;
    }
  }

  onFormSubmit(data: { title: string; completed: boolean }): void {
    // Validar que el título no esté vacío
    const title = data.title?.trim();
    if (!title || title.length < 3) {
      console.warn('Task title must be at least 3 characters');
      return;
    }

    if (this.editingTask) {
      const editingTaskId = this.editingTask.id;
      this.editingTask = null; // Limpiar inmediatamente
      
      this.taskService
        .updateTask(editingTaskId, {
          title: title,
          completed: data.completed,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Hecho
          },
          error: (error) => console.error('Error updating task:', error),
        });
    } else {
      this.taskService
        .createTask({
          title: title,
          completed: data.completed,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Hecho
          },
          error: (error) => console.error('Error creating task:', error),
        });
    }
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
  }

  onCancelEdit(): void {
    this.editingTask = null;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  onToggleComplete(id: number): void {
    this.taskService
      .toggleTaskComplete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // El servicio ya actualizó el estado
        },
        error: (error) => console.error('Error toggling task:', error),
      });
  }

  onDeleteTask(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService
        .deleteTask(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // El servicio ya actualizó el estado
          },
          error: (error) => console.error('Error deleting task:', error),
        });
    }
  }
}
