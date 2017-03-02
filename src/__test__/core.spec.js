import clone from 'ramda/src/clone'
import core, { itemKeys } from '../core'

describe('@monty/core', () => {
  const mockObjectValues = { foo: '', bar: {}, baz: [], qux: () => {} }
  const mockArrayValues = ['foo', {}, [], () => {}]

  afterEach(() => {
    core.clear
      .store()
      .componentNeeds()
      .routesHandlers()
  })

  it('has registered items', () => {
    expect(itemKeys).toMatchSnapshot()
  })

  describe('.register', () => {
    it('exposes a method for each core item', () => {
      expect(core.register).toMatchSnapshot()
    })

    describe('method for items initialised with array content', () => {
      it('concatenates the content value to the item array', () => {
        core.register.routesHandlers({ foo: () => {} })
        const before = core.get.routesHandlers()
        core.register.routesHandlers({ bar: () => {} })
        const after = core.get.routesHandlers()

        expect({ before, after }).toMatchSnapshot()
      })
      it('replaces the item with the content array if shouldReplace', () => {
        core.register.routesHandlers([{ baz: () => {} }, { qux: () => {} }])
        const before = core.get.routesHandlers()
        core.register.routesHandlers({ foo: () => {} }, true)
        const after = core.get.routesHandlers()

        expect({ before, after }).toMatchSnapshot()
      })
      it('replaces the item with an empty array if shouldReplace and content is nil', () => {
        core.register.routesHandlers({ baz: () => {} })
        const before = core.get.routesHandlers()
        core.register.routesHandlers(undefined, true)
        const after = core.get.routesHandlers()

        expect({ before, after }).toMatchSnapshot()
      })
    })

    describe('method for items initialised with plain object content', () => {
      it('throws if not called with a plain object', () => {
        expect(() => {
          core.register.componentNeeds(['foo'])
        }).toThrow(/register\.componentNeeds.*\["foo"\]/)
      })

      it('merges the content object with the item object', () => {
        core.register.componentNeeds({ foo: () => {}, bar: () => {} })
        const before = core.get.componentNeeds()
        core.register.componentNeeds({ baz: () => {} })
        const after = core.get.componentNeeds()

        expect({ before, after }).toMatchSnapshot()
      })

      it('replaces the item with the content object if shouldReplace', () => {
        core.register.componentNeeds({ baz: () => {}, qux: () => {} })
        const before = core.get.componentNeeds()
        core.register.componentNeeds({ foo: () => {} }, true)
        const after = core.get.componentNeeds()

        expect({ before, after }).toMatchSnapshot()
      })

      it('replaces the item with an empty object if shouldReplace and content is nil', () => {
        core.register.componentNeeds({ baz: () => {} })
        const before = core.get.componentNeeds()
        core.register.componentNeeds(undefined, true)
        const after = core.get.componentNeeds()

        expect({ before, after }).toMatchSnapshot()
      })
    })

    describe('method for items initialised with nil (any content)', () => {
      it('always replaces the item with the content value', () => {
        core.register.store({ baz: () => {} })
        const store1 = core.get.store()
        core.register.store(() => {})
        const store2 = core.get.store()
        core.register.store({})
        const store3 = core.get.store()

        expect({ store1, store2, store3 }).toMatchSnapshot()
      })
    })
  })

  describe('.clear', () => {
    it('exposes a method for each core item', () => {
      expect(core.clear).toMatchSnapshot()
    })

    describe('method for items with array content', () => {
      it('replaces the item with initial value', () => {
        const initialValue = core.get.routesHandlers()
        core.register.routesHandlers(mockArrayValues)
        core.clear.routesHandlers()
        expect(core.get.routesHandlers()).toEqual(initialValue)
      })
    })
    describe('method for items with plain object content', () => {
      it('replaces the item with initial value', () => {
        const initialValue = core.get.componentNeeds()
        core.register.componentNeeds(mockObjectValues)
        core.clear.componentNeeds()
        expect(core.get.componentNeeds()).toEqual(initialValue)
      })
    })
    describe('method for items with any content', () => {
      it('replaces the item with initial value', () => {
        const initialValue = core.get.store()
        core.register.store({})
        core.clear.store()
        expect(core.get.store()).toEqual(initialValue)
      })
    })
  })

  describe('.get', () => {
    it('exposes a method for each core item', () => {
      expect(core.get).toMatchSnapshot()
    })

    describe('method for items with array content', () => {
      it('returns the cloned value', () => {
        core.register.routesHandlers(clone(mockArrayValues))
        core.get.routesHandlers()[0] = 'foobarbazqux'
        expect(core.get.routesHandlers()).toEqual(mockArrayValues)
      })
    })
    describe('method for items with plain object content', () => {
      it('returns the cloned value', () => {
        core.register.componentNeeds(clone(mockObjectValues))
        core.get.componentNeeds().foobarbazqux = true
        expect(core.get.componentNeeds()).toEqual(mockObjectValues)
      })
    })
    describe('method for items with any content', () => {
      it('returns a cloned value', () => {
        const mockFunc = () => {}
        core.register.store(mockFunc)
        expect(core.get.store()).toEqual(mockFunc)

        core.register.store(clone(mockArrayValues))
        core.get.store()[0] = 'foobarbazqux'
        expect(core.get.store()).toEqual(mockArrayValues)

        core.register.store(clone(mockObjectValues))
        core.get.store().foobarbazqux = true
        expect(core.get.store()).toEqual(mockObjectValues)
      })
    })
  })
})
