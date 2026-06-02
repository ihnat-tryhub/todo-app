import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Todo, Priority, PRIORITY_ORDER } from '../models/todo.model';

interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/todos';
  private nextId = 10000;

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.loadingSubject.next(true);
    this.http.get<ApiTodo[]>(`${this.API_URL}?_limit=10`).pipe(
      map(apiTodos => apiTodos.map((t, i) => ({
        ...t,
        priority: PRIORITIES[i % 3] as Priority
      }))),
      catchError(() => of([] as Todo[]))
    ).subscribe(todos => {
      this.todosSubject.next(todos);
      this.loadingSubject.next(false);
    });
  }

  addTodo(title: string, priority: Priority): Observable<Todo> {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      completed: false,
      userId: 1,
      priority
    };
    return this.http.post<ApiTodo>(this.API_URL, { title, completed: false, userId: 1 }).pipe(
      map(() => newTodo),
      catchError(() => of(newTodo)),
      tap(() => {
        const current = this.todosSubject.getValue();
        this.todosSubject.next([newTodo, ...current]);
      })
    );
  }

  updateTodo(id: number, changes: Partial<Todo>): Observable<Todo> {
    const current = this.todosSubject.getValue();
    const todo = current.find(t => t.id === id);
    if (!todo) return of({} as Todo);
    const updated = { ...todo, ...changes };

    return this.http.put<ApiTodo>(`${this.API_URL}/${id}`, updated).pipe(
      map(() => updated),
      catchError(() => of(updated)),
      tap(() => {
        const todos = this.todosSubject.getValue().map(t => t.id === id ? updated : t);
        this.todosSubject.next(todos);
      })
    );
  }

  toggleTodo(id: number): Observable<Todo> {
    const todo = this.todosSubject.getValue().find(t => t.id === id);
    if (!todo) return of({} as Todo);
    return this.updateTodo(id, { completed: !todo.completed });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(() => of(undefined as void)),
      tap(() => {
        const todos = this.todosSubject.getValue().filter(t => t.id !== id);
        this.todosSubject.next(todos);
      })
    );
  }
}
