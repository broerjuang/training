# Intro to xstate

## Prerequisites

- Have node and yarn installed
- have nx console and xstate plugins

## Modeling Todo State

### React useState

```ts
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type State = {
  todos: Array<Todo>;
  currentTodo: string;
};

function Component() {
  let [currentTodo, setCurrentTodo] = useState<State['currentTodo']>('');
  let [todos, setTodos] = useState<State['todos']>([]);

  let submitTodo = () => {
    setTodos([...todos, { id: uuid(), text: currentTodo, completed: false }]);
    setCurrentTodo('');
  };

  let onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTodo(e.target.value);
  };

  let toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  let deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return ....
}
```

### React useReducer

```ts
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type State = {
  todos: Array<Todo>;
  currentTodo: string;
};

type Action =
  | { type: 'SET_CURRENT_TODO'; payload: string }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CURRENT_TODO':
      return { ...state, currentTodo: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: uuid(), text: action.payload, completed: false },
        ],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        }),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    default:
      return state;
  }
}

function Component() {
  let [state, dispatch] = useReducer(reducer, {
    todos: [],
    currentTodo: '',
  });

  return ....
}
```

One benefit of using `reducer` instead of `useState` is we can test the logic separately from the component. Reducer is pure function accepting `State` and `Action` and returning `State`.

```ts
type Reducer = (state: State, action: Action) => State;
```

### XState

```ts
type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type State = {
  todos: Array<Todo>;
  currentTodo: string;
};

type Event =
  | { type: 'SET_CURRENT_TODO'; payload: string }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string };

const todoMachine = createMachine<State, Event>({
  id: 'todo',
  initial: 'idle',
  context: {
    todos: [],
    currentTodo: '',
  },
  states: {
    idle: {
      on: {
        SET_CURRENT_TODO: {
          actions: assign({
            currentTodo: (_, event) => event.payload,
          }),
        },
        ADD_TODO: {
          actions: assign({
            todos: (context, event) => [
              ...context.todos,
              { id: uuid(), text: event.payload, completed: false },
            ],
            currentTodo: '',
          }),
        },
        TOGGLE_TODO: {
          actions: assign({
            todos: (context, event) => {
              return context.todos.map((todo) => {
                if (todo.id === event.payload) {
                  return { ...todo, completed: !todo.completed };
                }
                return todo;
              });
            },
          }),
        },
        DELETE_TODO: {
          actions: assign({
            todos: (context, event) => {
              return context.todos.filter((todo) => todo.id !== event.payload);
            },
          }),
        },
      },
    },
  },
});

function Component() {
  let [state, send] = useMachine(todoMachine);

  return ....
}
```
