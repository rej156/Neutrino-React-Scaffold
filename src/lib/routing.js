import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';
import once from 'ramda/src/once';
import flatten from 'ramda/src/flatten';
import core from '../core';

const encode = path => encodeURIComponent(path).replace(/%2F/g, '/').replace(/%3A/g, ':');

export const renderRedirect = ({ path, to }) => {
  const encoded = encode(path);
  const redirect = () => <Redirect to={to} />;

  return [<Route path={path} key={path} render={redirect} />].concat(
    path !== encoded ? <Route path={encoded} key={encoded} render={redirect} /> : [],
  );
};

export const renderRoute = ({ path, Component, props, routes, ...routeProps }) => {
  const encoded = encode(path);
  const component = matchProps => (
    <Component {...props} {...matchProps}>
      {routes &&
        <Switch>
          {routes.map(
            routeConfig => routeConfig.to ? renderRedirect(routeConfig) : renderRoute(routeConfig),
          )}
        </Switch>}
    </Component>
  );

  return [<Route path={path} key={path} render={component} {...routeProps} />].concat(
    path !== encoded
      ? <Route path={encoded} key={encoded} render={component} {...routeProps} />
      : [],
  );
};

// routeHandlers registered by features (../features/*/routes.js)
export const getRoutes = (...args) =>
  flatten(core.get.routesHandlers().map(routesHandler => routesHandler(...args)));

// router registered by Root (via ./withRootSetup.js)
export const registerRouter = once(core.register.router);
export const getRouter = () => core.get.router();
