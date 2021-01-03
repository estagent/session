import Session from './session'
import Token from './token'
import Request from './request'
import {dispatchSessionInvalidated, dispatchUserAuthenticated, dispatchUserSignedOut} from './dispacthers'

const parseAuthResponse = data => {

  if (!data.hasOwnProperty('auth') || data.auth !== true) throw 'auth not defined'
  if (!data.hasOwnProperty('user') || typeof data.user !== 'object') throw 'user not found in response'
  if (!data.hasOwnProperty('token') || typeof data.token !== 'object') throw 'token not found in response'
  if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string') throw 'csrf not found in response'

  Session.authenticated(data.user)
  Token.csrf = data.csrf
  Token.secret = data.token
}


export const authenticate = credentials => {
  return Request
    .post('auth/login', credentials)
    .then(data => {
      parseAuthResponse(data)
      dispatchUserAuthenticated(data)
      return data.user
    })
    .catch(error => {
      if (error.response.status === 405) {
        if (error.response && error.response.data) {
          const data = error.response.data
          if (data.auth === true) {
            dispatchSessionInvalidated()
          }
        }
      }
      throw error
    })
}

export const logout = () => {
  return Request
    .post('auth/logout')
    .then(response => {
      if (response.hasOwnProperty('auth') && response.auth === true) {
        Session.guest() // we will never destroy session.storage manually. to catch exact browser close.
        Token.delete()
        dispatchUserSignedOut()
        return true
      }
      throw 'unexpected response'
    })
}
