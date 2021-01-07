import {Request} from './index'
import Session from './session'
import {dispatchSessionRefreshed, dispatchUserUpdated} from './dispacthers'
import Events from './events'

let intervalIdentifier
const Config = {
  url: 'session',
  interval: 20000,
}

const setRefreshInterval = ms => (Config.interval = ms)
const setRefreshPath = url => (Config.url = url)

export const stopRefresh = () => {
  if (intervalIdentifier) clearInterval(intervalIdentifier)
  intervalIdentifier = null
}

const startRefresh = ms => {
  if (!intervalIdentifier)
    intervalIdentifier = setInterval(refreshSession, ms ?? Config.interval)
  return intervalIdentifier
}

const refreshSession = () => {
  Request.put(Config.url.concat('/').concat(Date.now().toString())).then(
    data => {
      dispatchSessionRefreshed(data)
      if (data.hasOwnProperty('user')) {
        const newUser = data.user
        const user = Session.user()
        if (!user || user.updated_at !== newUser.updated_at) {
          Session.authenticate(newUser)
          dispatchUserUpdated({
            old: user,
            user: newUser,
          })
        }
      }
    },
  )
}

const mountSession = () => {
  if (!Session.mounted())
    return Request.get(Config.url)
      .then(data => Session.mount(data))
      .catch(err => {
        console.log(err)
      })
}

const addListeners = () => {
  window.addEventListener(Events.SessionInitialized, mountSession)
  window.addEventListener(Events.SessionInvalidated, mountSession)
  window.addEventListener(Events.SessionDestroyed, () => stopRefresh())
  window.addEventListener(Events.SessionMounted, () => startRefresh())

  // window.addEventListener('online', () => console.log('came online'))
  // window.addEventListener('offline', () => console.log('came offline'))
}

export default {
  config: function (opts) {
    if (opts.hasOwnProperty('interval')) setRefreshInterval(opts.interval)
    if (opts.hasOwnProperty('path')) setRefreshPath(opts.path)
  },
  addListeners: addListeners,
}
