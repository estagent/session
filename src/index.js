import Session from './session'
import Events from './events'
import Request from './request'
import {mountSession} from './synchronizer'
import {authenticate, logout} from './authenticator'

export {
  Session, Events, Request,
}

export const bootSession = (options) => {
  if (options.url)
    Request.url(options.url)

  if (options.timeout)
    Request.timeout(options.timeout)

  Session.init()
  mountSession()

  window.addEventListener(Events.SessionExpired, mountSession)
  window.addEventListener(Events.SessionInvalidated, mountSession)

  return {
    authenticate: authenticate,
    logout: logout,
    isAuthenticated: Session.isAuthenticated,
  }
}
