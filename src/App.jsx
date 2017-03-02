import React from 'react';
import { Provider } from 'react-redux';
import Switch from 'react-router-dom/Switch';
import core from './core';
import withRootSetup from './lib/withRootSetup';
import { getRoutes, renderRoute, renderRedirect } from './lib/routing';

/**
 * Application init
 * - called by a renderer (Browser, Server, ...)
 * - renders registered routes within registered root component
 *
 * @param {object} store - initialised store
 * @param {Component} Router - Renderer's router component
 */
export default function App({ store, Router, ...routerProps }) {
  // Root component registered by main feature (./features/main)
  const Root = withRootSetup(core.get.rootComponent());

  return (
    <Provider store={store}>
      <Router {...routerProps}>
        <Root>
          <Switch>
            {getRoutes().map(route => route.to ? renderRedirect(route) : renderRoute(route))}
          </Switch>
        </Root>
      </Router>
    </Provider>
  );
}
