import { Component } from '@angular/core';
import { TaskListComponent } from './features/tasks/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent],
  template: `<app-task-list></app-task-list>`,
  styles: `
    :host {
      display: block;
      background-color: #f0f2f5;
      min-height: 100vh;
    }
  `
})
export class App {}
