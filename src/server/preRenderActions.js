import { path, omit } from 'ramda'

import paymentsHelper from './lib/payments-helper'

import * as authActions from '../../../../src/shared/actions/common/authActions'
import { userAccount } from '../../../../src/shared/actions/common/accountActions'
import { selectCountry } from '../../../../src/shared/actions/components/UserLocatorActions'
import { setOrderPendingConfirm, setOrderError } from '../../../../src/shared/actions/common/orderActions'
import { updateShoppingBagBadgeCount, setPromotionCode } from '../../../../src/shared/actions/common/shoppingBagActions'
import { setKlarnaSessionId, setKlarnaClientToken } from '../../../../src/shared/actions/common/klarnaActions'
import { setShippingDestination } from '../../../../src/shared/actions/common/shippingDestinationActions'

function getPromoCode(req) {
  return path(['url', 'query', 'ARCPROMO_CODE'], req) || req.state.arcpromoCode
}

export default ({ store, req, brandConfig }) => {
  const {
    jwtPayload,
    url: { pathname, query },
    state: { bagCount, bvToken }
  } = req

  const { country } = brandConfig

  store.dispatch(setShippingDestination(country))

  if (req.state.klarnaSessionId) store.dispatch(setKlarnaSessionId(req.state.klarnaSessionId))
  if (req.state.klarnaClientToken) store.dispatch(setKlarnaClientToken(req.state.klarnaClientToken))

  if (pathname === '/' && query.currentCountry) {
    store.dispatch(setShippingDestination(query.currentCountry))
  } else if (pathname === '/store-locator' && Object.keys(query).length) {
    store.dispatch(selectCountry(query.country || 'United Kingdom'))
  } else if (pathname === '/order-complete') {
    // payment redirect
    paymentsHelper(req, (data) => data
      ? store.dispatch(setOrderPendingConfirm(data))
      : store.dispatch(
        setOrderError('Unable to complete payment, please retry again later')
      )
    )
  }

  if (bagCount) store.dispatch(updateShoppingBagBadgeCount(parseInt(bagCount, 10)))

  // if promoCode is present in the cookie or query, set it in the store
  const ARCPROMO_CODE = getPromoCode(req)
  if (ARCPROMO_CODE) store.dispatch(setPromotionCode(ARCPROMO_CODE))

  const userPayload = omit(['arcadia-session-key', 'iat'], jwtPayload) || {}
  if (userPayload.exists) {
    store.dispatch(authActions.authLogin(bvToken))
    store.dispatch(userAccount(userPayload))
    store.dispatch(authActions.setAuthentication(true))
  }
  // forgotten password flow, getting email info from cookie
  if (userPayload.isPwdReset) {
    store.dispatch(userAccount(userPayload))
  }
}
