// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    addTodo: 'ADD_TODO';
    deleteTodo: 'DELETE_TODO';
    setCurrentTodo: 'SET_CURRENT_TODO';
    toggleTodo: 'TOGGLE_TODO';
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: 'idle';
  tags: never;
}
