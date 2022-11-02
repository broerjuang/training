import { v4 as uuid } from 'uuid';
import { createMachine, assign } from 'xstate';
import { client } from '@training/api-client';

type Todo = {
  id: string;
  title: string;
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
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUDoCuA7A1rqgO64DEGuYmAlrgG6r7VoY4FGkJ2MDGAhshqpcAbQAMAXQmTEoAA6pYNISLkgAHogBMAVl2Zt44wEYAbNvMAWcSYAc2gDQgAnoiu7xmT1fvj9xgDM4gDsAL5hzqxYeIQk5GAATomoiZjyADaCAGapALaY0exxXDyoAqpiUjLqisqV6loIegZGphbWtg7ObghmViGYgSEAnHqBZiG6wYGBEVHoWDQQGWBkAMoAogAqAPoAwgCqAErHmwBye9sA8gAi1zVIIHUqwriNiGZmdkNGunY2Ww2EYhHqIYaBTChbQjOz9cQTELaOaREBFZarMgAQVut12N3ujwUSleaieTW+kJMJl8JhGsws4jsJjBCF0IS8JimI10YxsdMC2nmaMWtBWaxuAHFJQAZTb4u4PKS1EkNcnuZGYOyBXw6syBEyBOzG1kQqFInlmTwmcR-YXo8VkW6bOXbeUEpWyJ4vNWgJpWbSDUKC5HUm12aas9mc7keHm2PThVFFRJgZCJFx0KBkDSwZCCaj8bLIJIACht4gAlGQU2mM1mic9VW8PggALQ2TAByz6Fo2sYjVkhOyDEIhMO2-QhMwmIXJ0Wp9OZ3DZ3P5kuYIslxLl4zV2tLhsmL3E+ot9XtunebRWEa2ulWWYwlmuRB8zBInXRqZfSYRVFEBAcDqEUsScO83rNmSfoaqyAyQlYzLTIEd4Rg4SYLGwGJgCqZ7QZoiC6GYXj9NMsLiPCI6gq+CCISYH7aMyViTLoRghIKZj2gudbLlAuGkhBMFskiWrEQCiZGFYzFDl8XZcuxJisdONhWFxbBJCkqYQPxvoEWyViYCMNieBRimTOIt6sja2hmFCPIjvq47sroamoDp55CW2xpdtoPasfo-YwqyjEGeIRniQMVo3jy-5hEAA */
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
                target: 'idle',
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
        setCurrentTodo: assign({
          currentTodo: (_, event) => event.payload,
        }),
        addTodo: assign({
          todos: (context: Context, event) => [
            ...context.todos,
            { id: uuid(), title: event.payload, completed: false },
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
            return response.data;
          }
        },
      },
    }
  );
