import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-item" [class.completed]="task.completed">
      <div class="task-content">
        <input
          type="checkbox"
          [checked]="task.completed"
          (change)="onToggleComplete()"
          class="task-checkbox"
          aria-label="Marcar tarea como completada"
        />
        <div class="task-text">
          <p class="task-title">{{ task.title }}</p>
          <p class="task-status">
            {{ task.completed ? 'Completado' : 'Pendiente' }}
          </p>
          <p class="task-modified">
            Modificado: {{ task.lastModified | date: 'short' }}
          </p>
        </div>
      </div>
      <div class="task-actions">
        <button
          class="btn btn-edit"
          (click)="onEdit()"
          aria-label="Editar tarea"
        >
          Editar
        </button>
        <button
          class="btn btn-delete"
          (click)="onDelete()"
          aria-label="Eliminar tarea"
        >
          Eliminar
        </button>
      </div>
    </div>
  `,
  styles: `
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      background-color: #fff;
      transition: all 0.3s ease;
    }

    .task-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .task-item.completed {
      background-color: #f5f5f5;
      opacity: 0.7;
    }

    .task-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .task-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #4caf50;
    }

    .task-text {
      flex: 1;
    }

    .task-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .task-item.completed .task-title {
      text-decoration: line-through;
      color: #999;
    }

    .task-status {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #666;
    }

    .task-modified {
      margin: 4px 0 0 0;
      font-size: 11px;
      color: #999;
    }

    .task-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .btn-edit {
      background-color: #2196f3;
      color: white;
    }

    .btn-edit:hover {
      background-color: #1976d2;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
    }

    .btn-delete:hover {
      background-color: #da190b;
    }

    @media (max-width: 600px) {
      .task-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .task-actions {
        align-self: flex-end;
        margin-top: 10px;
      }
    }
  `,
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();

  onToggleComplete(): void {
    this.toggleComplete.emit(this.task.id);
  }

  onEdit(): void {
    this.edit.emit(this.task);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }

  isCompleted(): boolean {
    return this.task.completed;
  }
}
