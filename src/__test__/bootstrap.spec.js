import core, { itemKeys } from '../core'

describe('@monty/bootstrap', () => {
  itemKeys.forEach((registerItem) => {
    core.get[registerItem] = jest.fn(core.get[registerItem])
    core.register[registerItem] = jest.fn(core.register[registerItem])
  })

  const ORIGINAL_NODE_ENV = process.env.NODE_ENV
  const mockCore = core

  const requireBootstrap = (mockFeaturesConfig) => {
    jest.mock('../features.config', () => mockFeaturesConfig)
    jest.mock('../core', () => mockCore)
    return require('../bootstrap')
  }

  beforeEach(() => {
    process.env.NODE_ENV = ORIGINAL_NODE_ENV
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('.featuresList', () => {
    it('returns list of * (default) features', () => {
      expect(requireBootstrap({
        '*': ['feature-a', 'feature-b', 'featureC']
      }).featuresList).toMatchSnapshot()
    })

    it('returns list of default + NODE_ENV features', () => {
      // default jest NODE_ENV = test
      expect(requireBootstrap({
        '*': ['feature-a', 'feature-b'],
        test: ['foo']
      }).featuresList).toMatchSnapshot()
    })

    it('returns list of development features if NODE_ENV is falsy', () => {
      process.env.NODE_ENV = ''
      expect(requireBootstrap({
        '*': [],
        development: ['dev-feature-1', 'dev-feature-2']
      }).featuresList).toMatchSnapshot()
    })

    it('returns empty list if no features specified', () => {
      expect(requireBootstrap({ '*': [] }).featuresList).toEqual([])
    })
  })

  describe('.bootstrapFeatures(getFeature)', () => {
    let bootstrap
    let featuresList
    const mockGetFeatures = jest.fn()
    const bootstrapFeatures = () => {
      bootstrap.bootstrapFeatures(mockGetFeatures)
    }

    const mockFeatures = {}

    beforeEach(() => {
      bootstrap = requireBootstrap({
        '*': ['featureA', 'featureB', 'featureC']
      })
      featuresList = bootstrap.featuresList

      featuresList.forEach((featureName) => {
        mockFeatures[featureName] = jest.fn(() => ({}))
        mockGetFeatures.mockImplementationOnce(mockFeatures[featureName])
      })
    })

    it('calls getFeature callback with feature name for each feature', () => {
      expect(mockGetFeatures).not.toBeCalled()
      bootstrapFeatures()

      expect(mockGetFeatures).toHaveBeenCalledTimes(featuresList.length)
      featuresList.forEach((featureName) => {
        expect(mockGetFeatures).toBeCalledWith(featureName)
      })
    })

    it('calls getFeature callback once for each feature', () => {
      expect(mockGetFeatures).not.toBeCalled()
      bootstrapFeatures()
      bootstrapFeatures()
      bootstrapFeatures()
      expect(mockGetFeatures).toHaveBeenCalledTimes(featuresList.length)
    })

    describe('feature Root component', () => {
      it('is only registers the first Root once', () => {
        mockFeatures.featureA.mockReturnValueOnce({
          Root: 'RootA'
        })

        mockFeatures.featureB.mockReturnValueOnce({
          Root: 'RootB'
        })

        expect(core.register.rootComponent).not.toBeCalled()
        bootstrapFeatures()
        expect(core.register.rootComponent).toBeCalledWith('RootA')
        expect(core.register.rootComponent).toHaveBeenCalledTimes(1)
      })

      it('is only registered if exported by feature', () => {
        mockFeatures.featureA.mockReturnValueOnce({})
        bootstrapFeatures()
        expect(core.register.rootComponent).not.toBeCalled()
      })
    })

    const testFeatureItems = [
      { itemName: 'getRoutes',
        registerMethodName: 'routesHandlers',
        itemValue: () => {}
      },
      { itemName: 'preRenderActions',
        defaultValue: [],
        itemValue: [() => {}]
      },
      { itemName: 'persistedStateKeys',
        defaultValue: [],
        itemValue: ['stateA', 'stateB']
      },
      { itemName: 'storeMiddleware',
        defaultValue: [],
        itemValue: [() => {}]
      },
      { itemName: 'initialState',
        defaultValue: {},
        itemValue: { stateA: 'A', stateB: 'B' }
      },
      { itemName: 'reducers',
        defaultValue: {},
        itemValue: { reducerA: () => {}, reducer: () => {} }
      },
      { itemName: 'sagas',
        defaultValue: [],
        itemValue: [() => {}]
      }
    ]

    testFeatureItems.forEach(({ itemName, registerMethodName, itemValue, defaultValue }) => {
      describe(`bootstraps feature ${itemName}`, () => {
        const registerMethod = core.register[registerMethodName || itemName]

        it('registers default value if item undefined', () => {
          expect(registerMethod).not.toBeCalled()
          bootstrapFeatures()
          expect(registerMethod).toHaveBeenCalledTimes(featuresList.length)
          expect(registerMethod).toBeCalledWith(defaultValue)
        })

        it('registers exported item for all features', () => {
          const mockFeature = {
            [itemName]: itemValue
          }
          mockFeatures.featureA.mockReturnValueOnce(mockFeature)

          expect(registerMethod).not.toBeCalled()
          bootstrapFeatures()
          expect(registerMethod).toHaveBeenCalledTimes(featuresList.length)
          expect(registerMethod).toBeCalledWith(mockFeature[itemName])
        })
      })
    })
  })
})
