const webpack = require('webpack');
const compose = require('ramda/src/compose');
const flatten = require('ramda/src/flatten');
const values = require('ramda/src/values');
const pick = require('ramda/src/pick');
const once = require('ramda/src/once');
const featuresConfig = require('./src/features.config.json');

const compileFeaturesList = compose(flatten, values, pick(['*', process.env.NODE_ENV || 'development']));
const featuresList = compileFeaturesList(featuresConfig);
const REGEXP_APP_FEATURES = new RegExp(`^./(${featuresList.join('|')})/index.js$`);

module.exports = neutrino => {
  neutrino.config.plugin('define').use(webpack.DefinePlugin, { REGEXP_APP_FEATURES });
  neutrino.config.plugin('named-modules').use(webpack.NamedModulesPlugin);
  neutrino.config.module.rule('compile').loader('babel', ({ options }) => {
    options.plugins.push([require.resolve('styled-jsx/babel')]);
    options.plugins.push([require.resolve('babel-plugin-transform-decorators-legacy')]);
    options.presets[0] = [require.resolve('babel-preset-stage-0')];

    return { options };
  });
};
