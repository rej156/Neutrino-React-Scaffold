import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import ReduxAsyncQueue from 'redux-async-queue';
import thunkMiddleware from 'redux-thunk';

import core from './core';

export const initStore = () => {
  const composeEnhancers = process.env.NODE_ENV !== 'production' && typeof window === 'object' ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :
    compose;

  const store = createStore(
    // Reducers registered by features (./features/*/reducers)
    // initialState registered by:
    // - ./server/render
    // - ./browser/render
    combineReducers(core.get.reducers()),
    core.get.initialState(),
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware,
        ReduxAsyncQueue,
        // Additional middleware registered by features (./features/*/middleware)
        ...core.get.storeMiddleware(),
      ),
    ),
  );

  // For server-side rendering to render view after saga promises
  core.register.store(store);

  return store;
};
