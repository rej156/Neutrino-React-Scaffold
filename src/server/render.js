import 'babel-polyfill'
import memoize from 'ramda/src/memoize'
import { renderToString } from 'react-dom/server'
import Router from 'react-router/StaticRouter'
import Helmet from 'react-helmet'

import { getBrandConfig } from './config/index'
import * as logger from './lib/logger'
import * as newrelic from './lib/newrelic'
import { getScripts, getStyles } from './lib/get-assets'
import getVersion from './lib/get-version'
import * as errorMessageActions from '../../../../src/shared/actions/common/errorMessageActions'

import getApp from '../app'
import core from '../core'
import { initStore } from '../store'
import { bootstrapFeatures } from '../bootstrap'

import fetchNeeds from './fetchNeeds'
import preRenderActions from './preRenderActions'

/**
 * Bootstrap features
 * - for server via dynamic require
 */
bootstrapFeatures((feature) => require('../features/' + feature))

const routerContext = {}
const debug = logger.debug.bind(logger, 'server-side-renderer')
const version = JSON.stringify(getVersion())

const getGeneratedAssets = memoize(() => require('../../../../public/generated-assets.json'))

const getLocale = (hostname) => (
  ['en', 'fr', 'de'].find((localeCode) => hostname.match(
    new RegExp(`m(.*)(\\.|\\-)(${localeCode})(\\.|\\-|\\b)`)
  )) || 'en'
)

const getViewData = ({ app, state, req, brandConfig }) => {
  const { title, meta, link } = Helmet.rewind()
  const { info: { hostname }, headers } = req
  const { region, brandName, lang, opentagRef } = brandConfig

  const html = renderToString(app)

  return {
    html,
    title: title.toString(),
    meta: meta.toString(),
    link: link.toString(),
    styles: getStyles(brandName),
    scripts: getScripts({
      googleMapsKey: process.env.GOOGLE_API_KEY,
      locale: getLocale(hostname),
      region,
      opentagRef
    }),
    lang,
    version,
    brandName,
    initialState: JSON.stringify(state).replace(/<(\/?)script>/g, '&lt;$1script>'), // #MON-1938,
    nreum: newrelic.getBrowserScript(),
    isRedAnt: !!headers['ar-app-bundleid'],
    webpackManifest: JSON.stringify(getGeneratedAssets().chunks)
  }
}

export default (req, reply) => {
  const {
    info: { hostname },
    state: { token },
    jwtPayload
  } = req

  debug(`hasToken: ${!!jwtPayload}`)
  debug(`authenticated: ${!!(jwtPayload && jwtPayload.exists)}`)
  debug(`session key: ${jwtPayload && jwtPayload['arcadia-session-key']}`)

  debug('initialise store')
  core.register.initialState({
    auth: {
      authentication: false,
      // token set here to use it when fetching component needs, not needed on the client
      token
    }
  })

  const store = initStore()

  const brandConfig = getBrandConfig(hostname)

  debug('prerender actions')
  // registered by features (../features/*/preRenderActions)
  core.get.preRenderActions()
    .map((onPreRender) => onPreRender({
      store, req, brandConfig, version, getGeneratedAssets
    }))

  // @TODO - decompose preRenderActions module
  // each app feature should register it's pre render actions to be executed by above
  preRenderActions({
    store, req, brandConfig, version, getGeneratedAssets
  })


  let app
  try {
    debug('initial app render')
    app = getApp({
      store, Router,
      location: req.url,
      context: routerContext
    })
    // Render app initially to resolve routes, registering component needs
    // due to react-router v4 now works - using react to render routes
    // App is rendered after needs are fetched
    renderToString(app)
  } catch(e) {
    logger.error(e)
    return reply(e)
  }

  const checkRedirect = () => {
    debug('ROUTER CONTEXT >>>', routerContext)
    const { redirect } = store.getState().routing
    // If an action places a redirect in the store
    // context.url will contain the URL to redirect to if a <Redirect> was used
    if (redirect || routerContext.url) {
      debug('handling redirect')
      // Throwing an object to exit the promise chain.
      // This prevents reply() from being called twice.
      throw { redirect } // eslint-disable-line no-throw-literal
    }
  }

  const renderView = () => {
    debug('rendering view')
    const state = store.getState()

    reply
      .view('index', getViewData({ app, state, req, brandConfig }))
      .code(state.routing.pageStatusCode || 200)
  }

  const renderErrorOrRedirect = (err) => {
    if (err.redirect) return reply.redirect(err.redirect)

    const state = store.getState()

    logger.error(err, { path: state.routing.location.pathname })
    // TODO: read error from language file
    store.dispatch(errorMessageActions.setGenericError(err))
    try {
      return reply
        .view('index', getViewData({ app, state, req, brandConfig }))
        .code(500)
    } catch (renderError) {
      logger.error(renderError)
      return reply(renderError)
    }
  }

  fetchNeeds(store)
    .then(checkRedirect)
    .then(renderView)
    .catch(renderErrorOrRedirect)
}
