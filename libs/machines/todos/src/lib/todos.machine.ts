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
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUDo0dgYgGUBRAFQH0BhAVQCUaiA5ckgeQBEWBtABgF1FQAB1SwAlslGoAdgJAAPRAFoATAEZMAVm4A2ZQBZuADj16A7Mu0bdAGhABPRAGZTGzAE5Hyw8rfcNejQ03AF9g2xwsCPwAQTY2MlYOHn4kEGExCWlZBQRVPU1vQw1TIwCjUz1tWwcEZRLMR24m1WLnKz1HUPD0SJ78VgBxAYAZIgT2Lj5ZdPFJGVScxW53VUMXE2VuH21TRyDqxFVtbQbTQ1VHNzdNqzdtLpAI7D68NiJRkjHEyZShEVmsgtEMoGptnIZHIZfJDlMpAgcEJDMNoOhVDMYzEUIQ8ngBXKQAaykqAA7lI8BgpGBMKIpAA3VAE6l4wnEskIWkMgDGAENMlJkslpv9+dklI5dJgtkZdBooY49EUNAiVHtMPptI5HKpdnDirCcT1MPiiaTyWAAE4W1AWzCCAA2fIAZjaALbPDDG1lmjn01C8-mCqapGaioEIRTmTCmFEuVaqNzFRWqFWNZYdbw+RN+Cp6Q2ek1s8mU6mcxnMo2Fn1lgNzQWqX5pEVzMURvZuTSKtTcFweVT9xwqo75Nw67hmVRbYyJ5T5rBgV2CZB2AAEUTwAEkpIJccgV1zcVawFI9xEhSHm4DQDkLB3vBpLjoAprtCn7EpVBZ3KYjj+dDKdlUOdMAXJdV3XHkIAgNcenPP4MhbcNnBOIotllUw3ACDEVTqdQLA0ft2gqOFMOA+1UEg2koBXWBcQAI1dcQYIwClpFLP0mQ9LByMoqRqNohimIiX1uT5Os+DgpsEKveQP3yTx0VhPRJ0hPJlBVMxlkw2MrmOKELjIiiIComj6MY08ejwS1rVtB1nTdLjMB44y+NMwSLIwET-TE6Qg0bUNEOvYEJQae9E37HwLEsVNLlOC49M1NxvE6B5iQgOBZCeKJhWk+YgojOFDE0HVNU2QD0UHd8I37dQWihHtPD2YwdGAqsyRygE8tkgqrmjTZ5SMfQmnHVMzgaVTpVhBVuA8YDrJtSAOrDfK8lcMwNWKbRfHOQxUyaKU9nMGMoU1LQNDmxdl2YkQlsC7rFHULY7lWLxjB8cd0SHa5MEnZTx0VP8tjzMJHiNZyTIE8zrtumScj0L8+w0NQTpjT89A0ioft8Y7nzhFx7hBiIYa6xY-qlfrZXlRV4SqxQrEcLGe20Ywii2wwCdCIA */
  createMachine(
    {
      context: { todos: [], currentTodo: '' } as Context,
      tsTypes: {} as import('./todos.machine.typegen').Typegen0,
      schema: { context: {} as Context, events: {} as Event },
      id: 'todo',
      initial: 'unknown',
      states: {
        todos: {
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
        unknown: {
          invoke: {
            src: 'fetch todos',
            onDone: [
              {
                target: 'empty todos',
                cond: 'has no todo items',
              },
              {
                target: 'todos',
              },
            ],
            onError: [
              {
                target: 'errored',
              },
            ],
          },
        },
        errored: {},
        'empty todos': {
          on: {
            'Input current todo': {
              actions: 'set current todo',
            },
            'add todo': {
              target: 'loading submit todo',
              cond: 'has current todo',
            },
          },
        },
        'loading submit todo': {
          invoke: {
            src: 'add todo to api',
            onDone: [
              {
                target: 'unknown',
              },
            ],
            onError: [
              {
                target: 'errored',
              },
            ],
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
