// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.todo.loading submit todo:invocation[0]': {
      type: 'done.invoke.todo.loading submit todo:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.todo.unknown:invocation[0]': {
      type: 'done.invoke.todo.unknown:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    'add todo to api': 'done.invoke.todo.loading submit todo:invocation[0]';
    'fetch todos': 'done.invoke.todo.unknown:invocation[0]';
  };
  missingImplementations: {
    actions: 'set current todo';
    services: 'add todo to api';
    guards: 'has no todo items' | 'has current todo';
    delays: never;
  };
  eventsCausingActions: {
    addTodo: 'ADD_TODO';
    deleteTodo: 'DELETE_TODO';
    'set current todo': 'Input current todo';
    setCurrentTodo: 'SET_CURRENT_TODO';
    toggleTodo: 'TOGGLE_TODO';
  };
  eventsCausingServices: {
    'add todo to api': 'add todo';
    'fetch todos':
      | 'done.invoke.todo.loading submit todo:invocation[0]'
      | 'xstate.init';
  };
  eventsCausingGuards: {
    'has current todo': 'add todo';
    'has no todo items': 'done.invoke.todo.unknown:invocation[0]';
  };
  eventsCausingDelays: {};
  matchesStates:
    | 'empty todos'
    | 'errored'
    | 'loading submit todo'
    | 'todos'
    | 'unknown';
  tags: never;
}
