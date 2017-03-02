import React, { Component } from 'react'
import { preCacheReset, retrieveCachedData } from '../features/main/actions/pageCacheActions'
import core from '../core'

import getDisplayName from './getDisplayName'

export default (ComponentWithPageCache) => class WithPageCache extends Component {
  static displayName = `withPageCache(${getDisplayName(ComponentWithPageCache)})`
  static WrappedComponent = ComponentWithPageCache.WrappedComponent || ComponentWithPageCache

  constructor(props) {
    super(props)
    if (!process.browser) {
      core.get.store()
        .dispatch(preCacheReset())
    }
  }

  componentDidMount() {
    core.get.store()
      .dispatch(retrieveCachedData())
  }

  render() {
    return <ComponentWithPageCache { ...this.props} />
  }
}
