import Session from './session'
import Events from './events'
import Request from './request'
import Token from './token'
import Authenticator from './authenticator'
import {mountSession, startRefresh, stopRefresh, setRefreshInterval, setRefreshPath} from './synchronizer'

export {
  Session, Events, Request, Authenticator, Token,
}

export const bootSession = (options = {}) => {

  if (options.hasOwnProperty('xhr')) {
    Request.config(options.xhr)
  }

  if (options.hasOwnProperty('auth')) {
    Authenticator.config(options.auth)
  }

  if (options.hasOwnProperty('token')) {
    Token.config(options.token)
  }

  if (options.hasOwnProperty('sync')) {

    if (options.sync.hasOwnProperty('interval'))
      setRefreshInterval(options.sync.interval)

    if (options.sync.hasOwnProperty('path'))
      setRefreshPath(options.sync.path)
  }

  window.addEventListener(Events.SessionInitialized, mountSession)
  window.addEventListener(Events.SessionExpired, mountSession)
  window.addEventListener(Events.SessionInvalidated, mountSession)
  window.addEventListener(Events.SessionMounted, () => startRefresh(), {once: true})

  Session.init()
  return {
    isAuthenticated: () => Session.isAuthenticated(),  // NOTE: this issue App/Session
    user: () => Session.user(),  // NOTE: this issue
    authenticate: Authenticator.authenticate, // anonymous function
    logout: Authenticator.logout,  //anonymous function
    setRefreshInterval: setRefreshInterval,
    stopRefresh: stopRefresh,
    startRefresh: startRefresh,
  }
}
