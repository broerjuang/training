import { v4 as uuid } from 'uuid';
import { createMachine, assign } from 'xstate';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Context = {
  todos: Array<Todo>;
  currentTodo: string;
};

type Event =
  | { type: 'SET_CURRENT_TODO'; payload: string }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

export const todoMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUDoCWEA2YAxAMoCiAKgPoDCAqgEr2kByV5A8gCLsDaADAF1EoAA6pY2ZNlQA7YSAAeiALQAmAIyYArHwBsqgCx8AHAYMB2Vbq36ANCACeiAMzmtmAJzPVx1R75aBlpaHgC+ofZoGDj4RACCnJyUHNz8QkggYhJSsvJKCOoG2r7GWuYmQSbmBrr2Tgiq5ZjOfK3qZa42Bs7hkehYuASEHADiIwAypMlcvILyWZLSchn5ynye6sZuZqp8frrmziF1iOq6us3mxurOHh67Nh66vSBRA7GEnKST5FMps+lROJFrkVohVM1dq5jM5jP5YapVMETghYZhdN1qsZTBZSjDwhEQDJ0HB5G8YgR5sCcstQKszu49sY+F4YaVgm4UcoDBDDj4dHpWsZdHCXm8qdklnkVBpnJgmSzYbDgmUtFybppzOoWSKPDYyuorATQkA */
  createMachine(
    {
      context: { todos: [], currentTodo: '' } as Context,
      tsTypes: {} as import('./todos.machine.typegen').Typegen0,
      schema: { context: {} as Context, events: {} as Event },
      id: 'todo',
      initial: 'idle',
      states: {
        idle: {
          on: {
            SET_CURRENT_TODO: {
              actions: 'setCurrentTodo',
            },
            ADD_TODO: {
              actions: 'addTodo',
            },
            TOGGLE_TODO: {
              actions: 'toggleTodo',
            },
            DELETE_TODO: {
              actions: 'deleteTodo',
            },
          },
        },
      },
    },
    {
      actions: {
        setCurrentTodo: assign({
          currentTodo: (_, event) => event.payload,
        }),
        addTodo: assign({
          todos: (context: Context, event) => [
            ...context.todos,
            { id: uuid(), text: event.payload, completed: false },
          ],
          currentTodo: '',
        }),
        toggleTodo: assign({
          todos: (context: Context, event) =>
            context.todos.map((todo) =>
              todo.id === event.payload
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
        }),
        deleteTodo: assign({
          todos: (context: Context, event) =>
            context.todos.filter((todo) => todo.id !== event.payload),
        }),
      },
    }
  );
