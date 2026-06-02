import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterType, SortType } from '../../models/todo.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent {
  @Input() currentFilter: FilterType = 'all';
  @Input() currentSort: SortType = 'none';
  @Input() totalCount = 0;
  @Input() activeCount = 0;
  @Input() completedCount = 0;

  @Output() filterChange = new EventEmitter<FilterType>();
  @Output() sortChange = new EventEmitter<SortType>();

  filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Всі' },
    { value: 'active', label: 'Активні' },
    { value: 'completed', label: 'Виконані' },
  ];

  sorts: { value: SortType; label: string }[] = [
    { value: 'none', label: 'За замовчуванням' },
    { value: 'priority-desc', label: 'Пріоритет ↓' },
    { value: 'priority-asc', label: 'Пріоритет ↑' },
  ];

  setFilter(filter: FilterType): void {
    this.filterChange.emit(filter);
  }

  setSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortType;
    this.sortChange.emit(value);
  }

  getCount(filter: FilterType): number {
    if (filter === 'all') return this.totalCount;
    if (filter === 'active') return this.activeCount;
    return this.completedCount;
  }
}
