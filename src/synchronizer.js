import Request from './request'
import Session from './session'
import {
  dispatchUserMounted,
  dispatchSessionRefreshed,
  dispatchSessionMounted,
  dispatchUserUpdated,
} from './dispacthers'
import Events from './events'

let intervalIdentifier
const Config = {
  url: 'session',
  interval: 20000,
}

const setRefreshInterval = (ms) => Config.interval = ms
const setRefreshPath = (url) => Config.url = url

export const stopRefresh = () => {
  if (intervalIdentifier) clearInterval(intervalIdentifier)
  intervalIdentifier = null
}

const startRefresh = (ms) => {
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

const mountSession = () => {
  return Request.get(Config.url)
    .then(data => {
      if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string') throw 'csrf not found in response'
      Request.mount(data)
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

const addListeners = () => {
  window.addEventListener(Events.SessionInitialized, mountSession)
  window.addEventListener(Events.SessionExpired, () => stopRefresh())
  window.addEventListener(Events.SessionExpired, mountSession)
  window.addEventListener(Events.SessionInvalidated, mountSession)
  window.addEventListener(Events.SessionMounted, () => startRefresh())

  window.addEventListener('online', () => console.log('came online'))
  window.addEventListener('offline', () => console.log('came offline'))

}

export default {
  config: function(opts) {
    if (opts.hasOwnProperty('interval'))
      setRefreshInterval(opts.interval)
    if (opts.hasOwnProperty('path'))
      setRefreshPath(opts.path)
  },
  addListeners: addListeners,
}
