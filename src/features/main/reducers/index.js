function createReducer(initialState, handlers) {
  return function reducer(state, action) {
    const newState = state === undefined ? initialState : state;

    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](newState, action);
    }

    return newState;
  };
}

const myReducer = createReducer([], { LOL: state => state });
const myReducer2 = createReducer([], { LOL: state => state });

export default { myReducer };
