// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'done.invoke.todo.unknown:invocation[0]': {
      type: 'done.invoke.todo.unknown:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.todo.unknown:invocation[0]': {
      type: 'error.platform.todo.unknown:invocation[0]';
      data: unknown;
    };
    'xstate.after(100)#todo.retrying': {
      type: 'xstate.after(100)#todo.retrying';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {
    fetchTodos: 'done.invoke.todo.unknown:invocation[0]';
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    'add todo': 'ADD_TODO';
    'delete todo': 'DELETE_TODO';
    'increment retry': 'xstate.after(100)#todo.retrying';
    'reset-retry': 'done.invoke.todo.unknown:invocation[0]';
    'set current todo': 'SET_CURRENT_TODO';
    'set todos from services': 'done.invoke.todo.unknown:invocation[0]';
    'toggle todo': 'TOGGLE_TODO';
  };
  eventsCausingServices: {
    fetchTodos: 'xstate.after(100)#todo.retrying' | 'xstate.init';
  };
  eventsCausingGuards: {
    'retry <== 3': 'xstate.after(100)#todo.retrying';
  };
  eventsCausingDelays: {};
  matchesStates: 'errored' | 'loaded' | 'retrying' | 'unknown';
  tags: never;
}
