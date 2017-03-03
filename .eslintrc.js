const Neutrino = require('neutrino');
const pkg = require('./package.json');
pkg.config.presets.splice(1, 1)
pkg.config.presets.splice(1, 1)
const api = new Neutrino(pkg.config.presets);

module.exports = api.custom.eslintrc();