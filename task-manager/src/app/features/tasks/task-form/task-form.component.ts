import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <div class="form-group">
        <label for="title" class="form-label">Título de la tarea</label>
        <input
          id="title"
          type="text"
          formControlName="title"
          placeholder="Ingresa el título de la tarea"
          class="form-input"
          [class.error]="
            taskForm.get('title')?.invalid &&
            (taskForm.get('title')?.dirty ||
              taskForm.get('title')?.touched)
          "
        />
        <div
          class="error-message"
          *ngIf="
            taskForm.get('title')?.invalid &&
            (taskForm.get('title')?.dirty ||
              taskForm.get('title')?.touched)
          "
        >
          <p *ngIf="taskForm.get('title')?.errors?.['required']">
            El título es obligatorio
          </p>
          <p *ngIf="taskForm.get('title')?.errors?.['minlength']">
            El título debe tener al menos
            {{ taskForm.get('title')?.errors?.['minlength'].requiredLength }}
            caracteres
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="completed" class="form-label">
          <input
            id="completed"
            type="checkbox"
            formControlName="completed"
            class="form-checkbox"
          />
          Marcar como completada
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-submit"
          [disabled]="taskForm.invalid"
        >
          {{ isEditMode ? 'Actualizar' : 'Crear' }} tarea
        </button>
        <button
          type="button"
          class="btn btn-cancel"
          (click)="onCancel()"
          *ngIf="isEditMode"
        >
          Cancelar
        </button>
      </div>
    </form>
  `,
  styles: `
    .task-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .form-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }

    .form-input.error {
      border-color: #f44336;
    }

    .error-message {
      margin-top: 8px;
      color: #f44336;
      font-size: 12px;
    }

    .error-message p {
      margin: 4px 0;
    }

    .form-checkbox {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      cursor: pointer;
      accent-color: #4caf50;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-submit {
      background-color: #4caf50;
      color: white;
      flex: 1;
    }

    .btn-submit:hover:not(:disabled) {
      background-color: #45a049;
    }

    .btn-submit:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-cancel:hover {
      background-color: #eeeeee;
    }
  `,
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Output() submit = new EventEmitter<{
    title: string;
    completed: boolean;
  }>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.taskForm) {
      if (this.task) {
        this.isEditMode = true;
        this.taskForm.patchValue({
          title: this.task.title,
          completed: this.task.completed,
        });
      } else {
        this.isEditMode = false;
        // Resetear completamente el formulario cuando se sale del modo edición
        this.taskForm.reset({title: '', completed: false}, {emitEvent: false});
        this.taskForm.markAsPristine();
        this.taskForm.markAsUntouched();
      }
    }
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      completed: [false],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const titleControl = this.taskForm.get('title');
      const completedControl = this.taskForm.get('completed');
      
      if (titleControl && completedControl) {
        const title = titleControl.value?.trim();
        
        if (title && title.length >= 3) {
          this.submit.emit({
            title: title,
            completed: completedControl.value,
          });
          
          if (!this.isEditMode) {
            this.taskForm.reset();
          }
        }
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.taskForm.reset();
  }
}
