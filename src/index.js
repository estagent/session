import Session from './session'
import Events from './events'
import Xhr from './xhr'
import Token from './token'
import Authenticator from './authenticator'
import Synchronizer from './synchronizer'

let Request

export {Session, Events, Request, Authenticator, Token}

export const bootSession = function (options = {}) {

    Request = new Xhr(options.xhr)

    if (options.hasOwnProperty('auth')) {
        Authenticator.config(options.auth)
    }

    if (options.hasOwnProperty('token')) {
        Token.config(options.token)
    }

    if (options.hasOwnProperty('sync')) Synchronizer.config(options.sync)

    Synchronizer.addListeners()
    Session.init()

    return {
        isAuthenticated: () => Session.isAuthenticated(), // NOTE: this issue App/Session
        user: () => Session.user(), // NOTE: this issue
        authenticate: Authenticator.authenticate, // anonymous function
        logout: Authenticator.logout, //anonymous function
    }
}
