import Request from './request'
import Token from './token'
import Session from './session'
import {
  dispatchUserMounted,
  dispatchSessionRefreshed,
  dispatchSessionMounted,
  dispatchUserUpdated,
} from './dispacthers'

let intervalIdentifier
const Config = {
  url: 'session',
  interval: 20000,
}

export const setRefreshInterval = (ms) => Config.interval = ms
export const setRefreshPath = (url) => Config.url = url

export const stopRefresh = () => {
  clearInterval(intervalIdentifier)
  intervalIdentifier = null
}
export const startRefresh = (ms) => {
  if (!intervalIdentifier)
    intervalIdentifier = setInterval(refreshSession, ms ?? Config.interval)
  return intervalIdentifier
}

const refreshSession = () => {
  Request.put(Config.url.concat('/').concat(Date.now().toString()))
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
  return Request.get(Config.url)
    .then(data => {
      if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string') throw 'csrf not found in response'
      Token.csrf = data.csrf
      dispatchSessionMounted(data)
      if (data.hasOwnProperty('auth') && data.auth === true) {
        if (!data.hasOwnProperty('user') || typeof data.user !== 'object') throw 'user not found in response'
        Session.authenticated(data.user)
        dispatchUserMounted(data)
      }
    }).catch(err => {
      console.log(err)
    })
}
