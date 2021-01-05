import Session from './session'
import Events from './events'
import Request from './request'
import Token from './token'
import Authenticator from './authenticator'
import Synchronizer from './synchronizer'

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

  if (options.hasOwnProperty('sync'))
    Synchronizer.config(options.sync)

  Synchronizer.addListeners()
  Session.init()

  return {
    isAuthenticated: () => Session.isAuthenticated(),  // NOTE: this issue App/Session
    user: () => Session.user(),  // NOTE: this issue
    authenticate: Authenticator.authenticate, // anonymous function
    logout: Authenticator.logout,  //anonymous function
  }
}
