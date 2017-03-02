import { getFeatures } from '../../../server/lib/features-service'
import { initFeatures } from '../actions/featuresActions'

export const configApp = ({ store, req, brandConfig }) => {
  const { state: { featuresOverride } } = req
  store.dispatch(
    initFeatures(getFeatures(brandConfig), featuresOverride)
  )
}
