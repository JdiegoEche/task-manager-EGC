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
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
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

  constructor(private taskService: TaskService) { }

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
        return [...tasks].sort((a, b) =>
          Number(a.completed) - Number(b.completed));
    }
  }

  onFormSubmit(data: { title: string; completed: boolean }): void {
    const title = data.title?.trim();
    if (!title || title.length < 3) {
      return;
    }

    if (this.editingTask) {
      const editingTaskId = this.editingTask.id;
      this.editingTask = null;

      this.taskService
        .updateTask(editingTaskId, {
          title: title,
          completed: data.completed,
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => { },
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
          next: () => { },
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
        next: () => { },
        error: (error) => console.error('Error toggling task:', error),
      });
  }

  onDeleteTask(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService
        .deleteTask(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => { },
          error: (error) => console.error('Error deleting task:', error),
        });
    }
  }
}
