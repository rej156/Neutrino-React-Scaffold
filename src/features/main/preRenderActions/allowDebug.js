import url from 'url'
import { allowDebug, setDebugInfo } from '../actions/debugActions'

export default ({ store, req, version }) => {
  const { url: { query } } = req

  const environment = url.parse(process.env.API_URL).host.split('.')[0]

  if (req.state.montydebug || typeof query.montydebug !== 'undefined') {
    store.dispatch(allowDebug())
    store.dispatch(setDebugInfo({ environment, buildInfo: JSON.parse(version) }))
  }
}
