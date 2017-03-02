import compose from 'ramda/src/compose';
import flatten from 'ramda/src/flatten';
import values from 'ramda/src/values';
import pick from 'ramda/src/pick';
import once from 'ramda/src/once';

import core from './core';
import featuresConfig from './features.config.json';

const compileFeaturesList = compose(flatten, values, pick(['*', process.env.NODE_ENV || 'development']));

/**
 * FeaturesList is used:
 * - here to import & bootstrap just the features in features.config.json
 * - in /build/config.js to define REGEXP_APP_FEATURES for ./browser/render
 */
export const featuresList = compileFeaturesList(featuresConfig);

/**
 * Bootstrap feature
 * - registers exported items as defined in core
 */
const bootstrapFeature = feature => {
  if (!feature) {
    return;
  }

  const {
    Root,
    getRoutes,
    preRenderActions = [],
    storeMiddleware = [],
    persistedStateKeys = [],
    initialState = {},
    reducers = {},
    sagas = [],
  } = feature;

  core.register
    .routesHandlers(getRoutes) // Used in ./app.js (via ./lib/routing.js)
    .preRenderActions(preRenderActions) // Used in ./server/render.js
    // @TODO implement usage (see ./browser/render/js)
    // used in ./browser/render.js & ./store
    .persistedStateKeys(persistedStateKeys)
    // - start used in ./store.js
    .storeMiddleware(storeMiddleware)
    .initialState(initialState)
    .reducers(reducers)
    .sagas(sagas);
  // - end used in ./store.js

  // Only register first Root component
  // this condition ensures it's not replaced accidentally
  if (Root && !core.get.rootComponent()) {
    core.register.rootComponent(Root);
  }
};

// Features are imported using getFeature that's passed in from server / browser renderer
export const bootstrapFeatures = once(getFeature => {
  featuresList.forEach(featureName => bootstrapFeature(getFeature(featureName)));
});
