import { v4 as uuid } from 'uuid';
import { createMachine, assign } from 'xstate';
import { client } from '@training/api-client';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Context = {
  todos: Array<Todo>;
  currentTodo: string;
  retry: number;
};

type Event =
  | { type: 'SET_CURRENT_TODO'; payload: string }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

export const todoMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUDoCuA7A1rqgO64DEGuYmAlrgG6r7VoY4FGkJ2MDGAhshqpcAbQAMAXQmTEoAA6pYNISLkgAHogBMAVl2Zt44wEYAbNvMAWcSYAc2gDQgAnoiu7xmT1fvj9xgDM4gDsAL5hzqxYeIQk5GAATomoiZjyADaCAGapALaY0exxXDyoAqpiUjLqisqV6loIegZGphbWtg7ObghmViGYgSEAnHqBZiG6wYGBEVHoWBmo-BCQZADKAKIAKgD6AMIAqgBKJ1sAcvs7APIAIjc1SCB1KsK4jYghDt4jdnZmSYhWbaEY9RCzVraKwjXRjYJmQImOaREBFZardYAQTudz2tweTwUSjeameTTMdkCmBMJl8JhGsws4jsJnBCF0IS8JimsLGNgZgW08zRi0wGLWEDItwA4jKADJbfH3R5SWokhrk9zIzB2LniJGWFnaMx09mggwjFlWGyBf5w-wi9ErSVkO5bRU7JUE1WyZ6vTWgJpWbSDUJC7RI2ks6bsznc3keWG2PThVFFRJgZCJFx0KBkDSwZCCaj8bLIJIAChMxgAlGQM1mc3miS8Ne9PggALQ2TAhyz6Fo1sZg1xfPWYEIhWk1lohU3C9NizPZ3O4fOF4sVzBliuJat1hvLptrqCiEx+4n1Dta7sM7zQq2WEZWEEjNljhD8yeRjxcqaApMESokQazwM8RSxJwHz+u2ZJBu4TifgM1JWKy0yBFadi6A4aYLGwEqQOq17wZoiC6GYXj9NMfziP0LJTuyaEmD+rJWJMuhGMCJpOseq55sRpIwQhHIhNouqUXYIackYNpmOy85mH2PLAiYnHzjYVi8WwSQpJmECCYGZEclYmAvv4ximhRXIwuys5KeIsJ6oi06cro2moIZN4iV2-x9toA6cfow6guadFmTMNYWBRgQDIuERAA */
  createMachine(
    {
      context: { todos: [], currentTodo: '', retry: 0 } as Context,
      tsTypes: {} as import('./todos.machine.typegen').Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Event,
        services: {} as {
          fetchTodos: {
            data: Array<Todo>;
          };
        },
      },
      id: 'todo',
      initial: 'unknown',
      states: {
        unknown: {
          invoke: {
            src: 'fetchTodos',
            onDone: [
              {
                target: 'loaded',
                actions: ['set todos from services', 'reset-retry'],
              },
            ],
            onError: [
              {
                target: 'retrying',
              },
            ],
          },
        },
        loaded: {
          on: {
            SET_CURRENT_TODO: {
              actions: 'set current todo',
            },
            ADD_TODO: {
              actions: 'add todo',
              description: 'Post new todo',
            },
            TOGGLE_TODO: {
              actions: 'toggle todo',
              description: 'Toggle between complete or not',
            },
            DELETE_TODO: {
              actions: 'delete todo',
              description: 'Delete todo',
            },
          },
        },
        retrying: {
          after: {
            '100': [
              {
                target: '#todo.unknown',
                cond: 'retry <== 3',
                actions: ['increment retry'],
                internal: false,
              },
              {
                target: '#todo.errored',
                actions: [],
                internal: false,
              },
            ],
          },
        },
        errored: {},
      },
    },
    {
      actions: {
        'set todos from services': assign((_, event) => ({
          todos: event.data,
        })),
        'set current todo': assign({
          currentTodo: (_, event) => event.payload,
        }),
        'add todo': assign({
          todos: (context: Context, event) => [
            ...context.todos,
            { id: uuid(), text: event.payload, completed: false },
          ],
          currentTodo: '',
        }),
        'toggle todo': assign({
          todos: (context: Context, event) =>
            context.todos.map((todo) =>
              todo.id === event.payload
                ? { ...todo, completed: !todo.completed }
                : todo
            ),
        }),
        'delete todo': assign({
          todos: (context: Context, event) =>
            context.todos.filter((todo) => todo.id !== event.payload),
        }),
        'reset-retry': assign({
          retry: (_context) => 0,
        }),
        'increment retry': assign({
          retry: (context) => context.retry + 1,
        }),
      },
      guards: {
        'retry <== 3': (context) => context.retry < 3,
      },
      services: {
        fetchTodos: async () => {
          const response = await client.getTodos();
          if (!response.success || !response.data) {
            throw new Error(response?.message || 'Unknown error');
          } else {
            return response.data.map(({ title, ...todo }) => ({
              ...todo,
              text: title,
            }));
          }
        },
      },
    }
  );
