import values from 'ramda/src/values'
import flatten from 'ramda/src/flatten'

import core from '../core'
import * as logger from './lib/logger'

const FETCH_TIMEOUT = 120
let fetchTimeoutID

export default (store) => {
  const startTimeout = () => new Promise((resolve, reject) => {
    clearTimeout(fetchTimeoutID)
    fetchTimeoutID = setTimeout(() => reject(
      new Error(`Fetch component needs timed out after ${FETCH_TIMEOUT}s`)
    ), FETCH_TIMEOUT * 1000)
  })

  // needs registered by containers in features (via ./withNeeds.js)
  const componentNeeds = core.get.componentNeeds()
  const fetchNeeds = Promise.all(flatten(values(componentNeeds)).map(store.dispatch))

  logger.debug('fetching needs for', Object.keys(componentNeeds))

  return Promise
    .race([fetchNeeds, startTimeout()])
    .then(() => Promise.race([store.sagaPromise, startTimeout()]))
    .then(() => {
      clearTimeout(fetchTimeoutID)
      core.clear.componentNeeds()
      logger.debug('done fetching needs', Object.keys(core.get.componentNeeds()))
    }, () => {
      core.clear.componentNeeds()
      store.close()
      logger.debug('failed fetching needs', Object.keys(core.get.componentNeeds()))
    })
}
