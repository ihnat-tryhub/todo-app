import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { TodoService } from '../../services/todo.service';
import { Todo, Priority, FilterType, SortType, PRIORITY_ORDER } from '../../models/todo.model';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoFormComponent, FilterBarComponent, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = false;

  currentFilter: FilterType = 'all';
  currentSort: SortType = 'none';
  editingTodo: Todo | null = null;

  totalCount = 0;
  activeCount = 0;
  completedCount = 0;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.loading$.pipe(takeUntil(this.destroy$)).subscribe(l => this.loading = l);

    this.todoService.todos$.pipe(takeUntil(this.destroy$)).subscribe(todos => {
      this.todos = todos;
      this.totalCount = todos.length;
      this.activeCount = todos.filter(t => !t.completed).length;
      this.completedCount = todos.filter(t => t.completed).length;
      this.applyFilterAndSort();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private applyFilterAndSort(): void {
    let result = [...this.todos];

    // Filter
    if (this.currentFilter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Sort
    if (this.currentSort === 'priority-desc') {
      result.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
    } else if (this.currentSort === 'priority-asc') {
      result.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }

    this.filteredTodos = result;
  }

  onFilterChange(filter: FilterType): void {
    this.currentFilter = filter;
    this.applyFilterAndSort();
  }

  onSortChange(sort: SortType): void {
    this.currentSort = sort;
    this.applyFilterAndSort();
  }

  onAddTodo(data: { title: string; priority: Priority }): void {
    this.todoService.addTodo(data.title, data.priority).subscribe();
  }

  onUpdateTodo(data: { title: string; priority: Priority }): void {
    if (!this.editingTodo) return;
    this.todoService.updateTodo(this.editingTodo.id, {
      title: data.title,
      priority: data.priority
    }).subscribe();
    this.editingTodo = null;
  }

  onToggle(id: number): void {
    this.todoService.toggleTodo(id).subscribe();
  }

  onDelete(id: number): void {
    if (this.editingTodo?.id === id) this.editingTodo = null;
    this.todoService.deleteTodo(id).subscribe();
  }

  onEdit(todo: Todo): void {
    this.editingTodo = todo;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancelEdit(): void {
    this.editingTodo = null;
  }

  trackByFn(_: number, item: Todo): number {
    return item.id;
  }
}
