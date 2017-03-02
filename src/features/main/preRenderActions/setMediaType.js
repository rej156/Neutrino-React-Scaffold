import parser from 'ua-parser-js'
import path from 'ramda/src/path'

import { updateMediaType } from '../actions/viewportActions'

export default ({ store, req }) => {
  let deviceType = 'desktop'  // NOTE: as parser does not recognise desktop devices
  if (req.headers && req.headers['user-agent']) {
    const parsedUa = parser(req.headers['user-agent'])
    deviceType = path(['device', 'type'], parsedUa) ? parsedUa.device.type : deviceType
  }
  store.dispatch(updateMediaType(deviceType))
}
