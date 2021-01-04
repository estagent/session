import Session from './session'
import Events from './events'
import Request from './request'
import {mountSession, startRefresh, stopRefresh, setRefreshInterval} from './synchronizer'
import {authenticate, logout} from './authenticator'

export {
  Session, Events, Request, authenticate, logout,
}

export const bootSession = (options = {}) => {

  if (options.hasOwnProperty('request'))
    for (let key of Object.keys(options.request))
      Request[key](options.request[key])

  if (options.hasOwnProperty('refreshInterval'))
    setRefreshInterval(options.refreshInterval)

  window.addEventListener(Events.SessionInitialized, mountSession)
  window.addEventListener(Events.SessionExpired, mountSession)
  window.addEventListener(Events.SessionInvalidated, mountSession)

  Session.init()

  return {
    authenticate: authenticate,
    logout: logout,
    isAuthenticated: () => Session.isAuthenticated(),  // NOTE: this issue App/Session
    setRefreshInterval: setRefreshInterval,
    stopRefresh: stopRefresh,
    startRefresh: startRefresh,
    user: () => Session.user(),  // NOTE: this issue
  }
}
