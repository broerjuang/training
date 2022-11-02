import { generate as v4 } from 'short-uuid';
import invariant from 'tiny-invariant';
import { join } from 'path';
import JSONDB from 'simple-json-db';

const TODOS_PATH = join(process.cwd(), '/apps/www-todo/db/db');

const db = new JSONDB(TODOS_PATH);

export function createTodo(title: string, completed = false) {
  const id = v4();
  db.set(id, { id, title, completed });
  return {
    id,
    title,
    completed,
  };
}

export function getTodos() {
  const rawTodos = db.JSON();
  return Object.keys(rawTodos).map((id) => rawTodos[id]);
}

export function getTodoById(id: string) {
  const todo = db.get(id);
  invariant(todo, `Todo with id ${id} not found`);
  return db.get(id);
}

export function updateTodoById(
  id: string,
  title?: string,
  completed?: boolean
) {
  const todo = db.get(id);
  invariant(todo, `Todo with id ${id} not found`);

  db.set(id, {
    ...todo,
    title: title || todo.title,
    completed: completed || todo.completed,
  });
  return {
    ...todo,
    title: title || todo.title,
    completed: completed || todo.completed,
  };
}

export function deleteTodoById(id: string) {
  const todo = db.get(id);
  invariant(todo, `Todo with id ${id} not found`);
  db.delete(id);
  return {
    success: true,
    message: 'Todo deleted successfully',
  };
}
