export interface Task {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  lastModified: Date;
}

export interface CreateTaskDto {
  title: string;
  completed?: boolean;
}

export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}
