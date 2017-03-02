import { updateLocationServer } from '../actions/routingActions'

export const configApp = ({ store, req }) => {
  const { info: { hostname } } = req
  store.dispatch(updateLocationServer(req.url, hostname))
}
