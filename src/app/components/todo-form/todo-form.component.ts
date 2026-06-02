import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnChanges {
  @Input() editingTodo: Todo | null = null;
  @Output() addTodo = new EventEmitter<{ title: string; priority: Priority }>();
  @Output() updateTodo = new EventEmitter<{ title: string; priority: Priority }>();
  @Output() cancelEdit = new EventEmitter<void>();

  form: FormGroup;
  priorities: Priority[] = ['low', 'medium', 'high'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      priority: ['medium', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTodo'] && this.editingTodo) {
      this.form.patchValue({
        title: this.editingTodo.title,
        priority: this.editingTodo.priority
      });
    } else if (changes['editingTodo'] && !this.editingTodo) {
      this.form.reset({ title: '', priority: 'medium' });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const { title, priority } = this.form.value;
    if (this.editingTodo) {
      this.updateTodo.emit({ title: title.trim(), priority });
    } else {
      this.addTodo.emit({ title: title.trim(), priority });
    }
    this.form.reset({ title: '', priority: 'medium' });
  }

  cancel(): void {
    this.form.reset({ title: '', priority: 'medium' });
    this.cancelEdit.emit();
  }

  getPriorityLabel(p: Priority): string {
    return { low: 'Низький', medium: 'Середній', high: 'Високий' }[p];
  }
}
