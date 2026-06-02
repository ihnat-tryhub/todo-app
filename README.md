# TaskFlow — Angular Todo List

Простий веб-додаток для ведення списку справ на Angular.

## Опис проекту

Цей додаток реалізує базові можливості менеджера завдань зі збереженням даних через публічний API JSONPlaceholder. Користувач може додавати, редагувати, видаляти та позначати завдання як виконані.

## Функціонал

- Додавання нових завдань
- Редагування існуючих завдань
- Позначення завдань як виконаних / невиконаних
- Видалення завдань
- Фільтрація: `Всі`, `Активні`, `Виконані`
- Сортування за пріоритетом: `низький`, `середній`, `високий`
- Підключення до симульованого бекенду через `JSONPlaceholder`

## Технічний стек

- Angular 21
- TypeScript
- RxJS
- Standalone-компоненти
- `@angular/common/http` для HTTP-запитів
- `zone.js` для конфігурації Angular

## Структура ключових файлів

- `src/app/app.ts` — кореневий компонент
- `src/app/components/todo-list/todo-list.component.ts` — контейнер списку задач
- `src/app/components/todo-form/todo-form.component.ts` — форма додавання / редагування задач
- `src/app/components/todo-item/todo-item.component.ts` — віджет одного завдання
- `src/app/components/filter-bar/filter-bar.component.ts` — панель фільтрів та сортування
- `src/app/services/todo.service.ts` — сервіс для роботи з JSONPlaceholder API
- `src/app/models/todo.model.ts` — типи задач та пріоритетів

## Запуск локально

```bash
npm install
npm start
```

Потім відкрийте у браузері `http://localhost:4200`.

## Побудова проекту

```bash
npm run build
```

Результат збірки знаходиться в папці `dist/todo-app`.

## Підготовка для GitHub

1. Ініціалізуйте репозиторій Git (якщо ще не зроблено):
   ```bash
git init
```
2. Додайте всі файли до коміту:
   ```bash
git add .
```
3. Зробіть початковий коміт:
   ```bash
git commit -m "Initial TaskFlow Angular todo app"
```
4. Створіть репозиторій на GitHub і додайте віддалений URL:
   ```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
```
5. Запуште на GitHub:
   ```bash
git push -u origin main
```

## Коментар

Проект готовий як тестове завдання на Angular. Якщо потрібно, можу додатково підготувати короткий опис для GitHub-сумки або допомогти з деплоєм на GitHub Pages чи Vercel.
