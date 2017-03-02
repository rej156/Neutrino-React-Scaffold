export default function createReducer(initialState, handlers) {
  return function reducer(state, action) {
    const newState = state || initialState;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](newState, action);
    }

    return newState;
  };
}

