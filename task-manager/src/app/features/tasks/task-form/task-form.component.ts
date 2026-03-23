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
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
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
