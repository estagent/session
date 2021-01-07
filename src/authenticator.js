import Session from './session'
import {Request} from './index'
import {dispatchUserAuthenticated, dispatchUserSignedOut} from './dispacthers'

const Config = {
  login: 'auth/login',
  logout: 'auth/logout',
}

const authenticate = credentials => {
  return Request.post(Config.login, credentials)
    .then(data => {
      Session.authenticate(data)
      dispatchUserAuthenticated(data)
      return data.user
    })
    .catch(error => {
      if (error.response.status === 405) {
        if (error.response && error.response.data) {
          const data = error.response.data
          if (data.auth === true) {
            Session.invalidate()
          }
        }
      }
      throw error
    })
}

const logout = () => {
  return Request.post(Config.logout).then(response => {
    if (response.hasOwnProperty('auth') && response.auth === true) {
      Session.guest() // we will never destroy session.storage manually. to catch exact browser close.
      dispatchUserSignedOut()
      return true
    }
    throw 'unexpected response'
  })
}

export default {
  config(opts) {
    for (let key of Object.keys(opts)) {
      switch (key) {
        case 'login':
          Config.login = opts.login
          break
        case 'logout':
          Config.logout = opts.logout
          break
        default:
          throw `Init Error: unknown auth config option ${key}`
      }
    }
    return this
  },
  authenticate: authenticate,
  logout: logout,
}
