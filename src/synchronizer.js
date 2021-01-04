import Request from './request'
import Token from './token'
import Session from './session'
import {dispatchUserMounted, dispatchSessionRefreshed, dispatchSessionMounted, dispatchUserUpdated} from './dispacthers'

let intervalHandler
let refreshInterval = 20000

export const setRefreshInterval = (ms) => refreshInterval = ms
export const stopRefresh = () => clearInterval(intervalHandler)
export const startRefresh = (ms) => {
  if (!intervalHandler)
    intervalHandler = setInterval(refreshSession, ms ?? refreshInterval)
  return intervalHandler
}

const refreshSession = () => {
  Request.put('session/'.concat(Date.now().toString()))
    .then((data) => {
      dispatchSessionRefreshed(data)
      if (data.hasOwnProperty('user')) {
        const newUser = data.user
        const user = Session.user()
        if (!user || user.updated_at !== newUser.updated_at) {
          Session.authenticated(newUser)
          dispatchUserUpdated({
            old: user,
            user: newUser,
          })
        }
      }
    })
}


export const mountSession = () => {
  Request.get('session').then(data => {
    if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string') throw 'csrf not found in response'
    Token.csrf = data.csrf
    dispatchSessionMounted(data)
    if (data.hasOwnProperty('auth') && data.auth === true) {
      if (!data.hasOwnProperty('user') || typeof data.user !== 'object') throw 'user not found in response'
      Session.authenticated(data.user)
      dispatchUserMounted(data)
    }
  })
}
