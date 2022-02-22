import type { Id, Task } from '../types';

export interface Column {
  id: Id;
  title: string;
  taskIds: Id[];
}

export type ColumnMap = {
  [columnId in Id]: Column;
};

export type TaskMap = {
  [taskId in Id]: Task;
};

export interface Entities {
  columnOrder: Id[];
  columns: ColumnMap;
  tasks: TaskMap;
}
