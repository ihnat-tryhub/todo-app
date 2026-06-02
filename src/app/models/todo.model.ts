export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'none' | 'priority-asc' | 'priority-desc';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  priority: Priority;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};
