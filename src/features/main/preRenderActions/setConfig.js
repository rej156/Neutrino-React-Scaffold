import { getBrandHostnames } from '../../../server/config/index'
import { isDayLightSaving } from '../../../server/lib/date-time-utils'

import * as configActions from '../actions/configActions'

export const appConfig = ({ store, brandConfig, getGeneratedAssets }) => {
  const { brandName } = brandConfig

  store.dispatch(configActions.setConfig(brandConfig))
  store.dispatch(configActions.setBrandHostnames(getBrandHostnames(brandName)))
  store.dispatch(configActions.isDayLightSavingTime(isDayLightSaving()))
  store.dispatch(configActions.setAssets(getGeneratedAssets()))
}
