import { setAdobeAnalyticsEnv } from '../actions/analyticsActions'
import { setPeeriusDomain } from '../actions/peeriusActions'

export default ({ store }) => {
  store.dispatch(setPeeriusDomain())
  store.dispatch(setAdobeAnalyticsEnv(process.env.ADOBE_ANALYTICS_ENV))
}
