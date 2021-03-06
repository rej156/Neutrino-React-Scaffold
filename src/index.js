/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
import { combineReducers } from 'redux';
import { AppContainer } from 'react-hot-loader';
import Router from 'react-router-dom/BrowserRouter';
import getApp from './App';
import core from './core';
import initStore from './store';
import { bootstrapFeatures } from './bootstrap';

/**
 * Bootstrap features for browser
 * - brought to you by ... Webpack for require.context + DefinePlugin for REGEXP_APP_FEATURES
 */

// const REGEXP_APP_FEATURES = new RegExp(`^./(${featuresList.join('|')})/index.js$`);
// Console.log(REGEXP_APP_FEATURES);

const requireFeature = require.context('./features', true, REGEXP_APP_FEATURES);
bootstrapFeatures(feature => requireFeature(`./${feature}/index.js`));
/**
 * @TODO
 * implement getPersistedState from localStorage
 * this should be set via redux store enhancer using core.get.persistedStateKeys()
 * @example
 *  const getPersistedState = () => JSON.parse(localStorage.getItem('@monty/state'))
 *  const initialState = { ...window.__INITIAL_STATE__, ...getPersistedState() }
 */
const initialState = window.INITIAL_STATE;
core.register.initialState(initialState);

const store = initStore();
const rootEl = document.getElementById('root');

const load = component => render(<AppContainer>{component}</AppContainer>, rootEl, () => {
  rootEl.classList.remove('nojs');
});

const modules = {};
requireFeature.keys().forEach(key => {
  const module = requireFeature(key);
  modules[key] = module;
  load(getApp({ store, Router }));
});

if (module.hot) {
  module.hot.accept(requireFeature.id, () => {
    const requireFeature = require.context('./features', true, REGEXP_APP_FEATURES);
    core.clear.reducers();
    bootstrapFeatures(feature => requireFeature(`./${feature}/index.js`));
    store.replaceReducer(combineReducers(require('./core').default.get.reducers()));
    const getComponent = require('./App.jsx').default;
    const component = getComponent({ store, Router });
    load(component);

    const changedModules = requireFeature
      .keys()
      .map(key => [key, requireFeature(key)])
      .filter(reloadedModule => modules[reloadedModule[0]] !== reloadedModule[1]);
    changedModules.forEach(module => {
      modules[module[0]] = module[1];
    });
  });
}
