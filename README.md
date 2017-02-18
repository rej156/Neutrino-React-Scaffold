# React Starter

Create React apps with zero initial configuration. `react-starter` is built using [Neutrino](https://github.com/mozilla-neutrino/neutrino-dev) to harness the power of Webpack with the simplicity of [presets](https://neutrino.js.org/presets/). 
 
## Features
- Zero upfront configuration necessary to start developing and building a React web appZero upfront configuration necessary to start developing and building a React web app
- Extends from [neutrino-preset-react](https://neutrino.js.org/presets/neutrino-preset-react/)
  - Modern Babel compilation adding JSX and object rest spread syntax
  - Support for React Hot Loader
  - Write JSX in .js or .jsx files 
- Extends from [neutrino-preset-web](https://neutrino.js.org/presets/neutrino-preset-web/)
  - Modern Babel compilation supporting ES modules, last 2 major browser versions, and async functions
  - Webpack loaders for importing HTML, CSS, images, icons, and fonts
  - Webpack Dev Server during development
  - Automatic creation of HTML pages, no templating necessary
  - Hot Module Replacement support
  - Production-optimized bundles with Babili minification and easy chunking
  - Easily extensible to customize your project as needed
- Extends from [neutrino-preset-airbnb-base](https://neutrino.js.org/presets/neutrino-preset-airbnb-base/)
  - Zero upfront configuration necessary to start linting your project
  - Modern Babel knowledge supporting ES modules, JSX, Web and Node.js apps
  - Highly visible during development, fails compilation when building for production
  - Easily extensible to customize your project as needed

## Requirements

- Node.js v6.9+
- Yarn or npm client

## Installation

To get you started you can simply clone the react-starter repository and install the dependencies using Yarn or the npm client.

```bash
❯ git clone git@github.com:mozilla-neutrino/react-starter.git 
❯ cd react-starter/
❯ yarn
```

## Quick start

### Yarn

```bash 
❯ yarn start
✔ Development server running on: http://localhost:5000
✔ Build completed
```

### npm
````bash
❯ npm start
✔ Development server running on: http://localhost:5000
✔ Build completed
````

## Building

`react-starter` builds static assets to the `build` directory by default when running `yarn build`.

```bash
❯ yarn build
clean-webpack-plugin: /react/build has been removed.
Build completed in 7.646s

Hash: 284a1593931a152b5ca3
Version: webpack 2.2.1
Time: 7653ms
                                  Asset       Size  Chunks             Chunk Names
  vendor.5420d264defb1f585e8c.bundle.js     143 kB    0, 2  [emitted]  vendor
   index.73592a94bf864288fed6.bundle.js    7.08 kB    1, 2  [emitted]  index
manifest.6a4a611c5987c206c212.bundle.js    1.44 kB       2  [emitted]  manifest
                             index.html  866 bytes          [emitted]
                                App.css   26 bytes          [emitted]
✨  Done in 8.72s.
```

## Customizing

To override the build configuration, start with the documentation on [customization](https://neutrino.js.org/customization/). `neutrino-preset-react` does not use any additional named rules, loaders, or plugins that aren't already in use by the Web preset. See the [Web documentation customization](https://neutrino.js.org/presets/neutrino-preset-web/#customizing) for preset-specific configuration to override.

### Simple customization

By following the [customization guide](https://neutrino.js.org/customization/simple.html) and knowing the rule, loader, and plugin IDs above, you can override and augment the build directly from package.json.

#### Vendoring

To achieve long term caching benefits, you can make use of code splitting. Neutrino exposes a `vendor` entry point in package.json where third party libraries can be split into a chunk separate from your application code. 

This starter kit splits React and React DOM into the `vendor` chunk for you. Before going to production, it is recommended to push the rest of your dependencies to `vendor`.

````json
{
  "config": {
    "neutrino": {
      "entry": {
        "vendor": [
          "react",
          "react-dom"
        ]
      }
    }
  },
  "dependencies": {
    "react": "^15.4.2",
    "react-dom": "^15.4.2"
  }
}
````

#### HTML files

If you wish to override how HTML files are created for your React app, refer to the [relevant section on
neutrino-preset-web](https://neutrino.js.org/presets/neutrino-preset-web/#html-files).

_Example: Change the application mount ID from "root" to "app":_

```json
{
  "config": {
    "html": {
      "appMountId": "app"
    }
  }
}
```

### Advanced configuration

By following the [customization guide](https://neutrino.js.org/customization/advanced.html) and knowing the rule, loader, and plugin IDs from
neutrino-preset-web, you can override and augment the build by creating a JS module which overrides the config.

#### Vendoring

By defining an entry point named `vendor` you can split out external dependencies into a chunk separate
from your application code.

_Example: Put React and React DOM into a separate "vendor" chunk:_

```js
module.exports = neutrino => {
  neutrino.config
    .entry('vendor')
      .add('react')
      .add('react-dom');
};
```

## Contributing

Thank you for wanting to help out with Neutrino! We are very happy that you want to contribute, and have put together the [contributing guide](https://neutrino.js.org/contributing/#contributing) to help you get started. We want to do our best to help you make successful contributions and be part of our community.