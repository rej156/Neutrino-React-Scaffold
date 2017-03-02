import { getLocaleDictionary } from '../../../lib/localisation'
import { setLocaleDictionary } from '../actions/localisationActions'

export const configApp = ({ store, brandConfig }) => {
  const { brandName, language } = brandConfig
  store.dispatch(setLocaleDictionary(getLocaleDictionary(language, brandName)))
}
