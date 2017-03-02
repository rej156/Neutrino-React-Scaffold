import clone from 'ramda/src/clone';
import uniq from 'ramda/src/uniq';
import isNil from 'ramda/src/isNil';

// Core API
const core = {
  clear: {},
  get: {},
  register: {},
};
export default core;

// Top-level application items
// the initial value determines how items are registered / updated
// - for []: allows any item & register "uniquely" concatenates
// - for {}: only allows object items & register merges
// - for null | undefined: allows any item & register replacea
const coreItems = {
  componentNeeds: {},
  initialState: {},
  persistedStateKeys: [],
  preRenderActions: [],
  reducers: {},
  rootComponent: null,
  router: null,
  routesHandlers: [],
  store: null,
  storeMiddleware: [],
};

const isObject = val =>
  val !== null && !Array.isArray(val) && val instanceof Object && typeof val === 'object';

class CoreItem {
  constructor(key) {
    this.key = key;
    this.initialValue = this.get();
  }

  register = (value, shouldReplace) => {
    const key = this.key;
    const currentValue = this.get();

    const done = updatedValue => {
      coreItems[key] = updatedValue;

      return core.register;
    };

    if (isNil(value)) {
      return done(shouldReplace ? this.initialValue : currentValue);
    }

    if (Array.isArray(this.initialValue)) {
      return done(shouldReplace ? [].concat(value) : uniq(currentValue.concat(value)));
    }

    if (isObject(this.initialValue)) {
      if (!isObject(value) && !shouldReplace) {
        throw new Error(
          `core.register.${key}() expects an object, you passed ${JSON.stringify(value)}.`,
        );
      }

      return done(shouldReplace ? value : { ...currentValue, ...value });
    }

    return done(value);
  };

  clear = () => {
    this.register(null, true);

    return core.clear;
  };

  get = () => clone(coreItems[this.key]);
}

/**
 * All core item keys
 */
export const itemKeys = Object.keys(coreItems);

/**
 * Assign getter & setter functions for core items, e.g:
 * - core.register.store(createStore(...))
 * - core.clear.store()
 * - core.get.store()
 */
itemKeys.forEach(key => {
  const item = new CoreItem(key);

  core.register[key] = item.register;
  core.clear[key] = item.clear;
  core.get[key] = item.get;
});
