import {
  dispatchSessionCreated,
  dispatchSessionDestroyed,
  dispatchSessionInitialised,
  dispatchSessionInvalidated,
  dispatchSessionMounted,
  dispatchUserMounted,
  dispatchUserUnmounted,
} from './dispacthers'
import {Token} from './index'

let authenticated, csrf

export default {
  createdAt: function () {
    const createdAt = this.get('createdAt')
    if (createdAt) return parseInt(createdAt)
  },
  seconds: function () {
    return Date.now() - this.get('createdAt')
  },
  clear: function () {
    const alreadyStarted = !!this.get('createdAt')
    console.log('session cleared!')
    sessionStorage.clear()
    if (alreadyStarted) dispatchSessionDestroyed()
    return this
  },
  renew: function () {
    this.clear().set('createdAt', Date.now())
    dispatchSessionCreated()
  },
  set: function (key, val) {
    sessionStorage.setItem(
      key,
      val instanceof Object ? JSON.stringify(val) : val,
    )
    sessionStorage.setItem('updatedAt', Date.now().toString())
    return this
  },
  remove: function (key) {
    sessionStorage.removeItem(key)
    return this
  },
  get: function (key) {
    return sessionStorage.getItem(key)
  },
  isAuthenticated: function () {
    return JSON.parse(this.get('auth')) === true
  },
  authenticate: function (data) {
    if (!data.hasOwnProperty('auth') || data.auth !== true)
      throw 'auth not defined'
    if (!data.hasOwnProperty('user') || typeof data.user !== 'object')
      throw 'user not found in response'

    authenticated = data.user
    this.set('auth', data.auth)
    this.csrf = data.csrf
    if (data.hasOwnProperty('token')) this.token = data.token

    dispatchUserMounted(data)
    return this
  },
  guest: function () {
    authenticated = undefined
    this.set('auth', false).remove('user').deleteToken().deleteCsrf()
    dispatchUserUnmounted()
  },
  invalidate() {
    // when session data does not comply with server data.  like guest middleware, authenticated user not mounted.
    if (this.isAuthenticated()) this.guest()
    else if (this.mounted()) this.deleteCsrf()
    dispatchSessionInvalidated() // must be mounted
  },
  expire() {
    // when session timeout but client does not know
    if (this.isAuthenticated()) this.guest()
    else if (this.mounted()) this.deleteCsrf()
    this.clear()
    this.init()
  },
  mount(data) {
    if (!this.mounted()) {
      if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string')
        throw 'csrf not found in response'
      this.csrf = data.csrf
      if (data.hasOwnProperty('auth') && data.auth === true) {
        this.authenticate(data)
      }
    } else console.warn('session already mounted')
  },
  user: function () {
    if (this.isAuthenticated) return authenticated
  },
  set csrf(string) {
    if (typeof string !== 'string') throw 'csrf must be string'
    csrf = string
    dispatchSessionMounted()
  },
  get csrf() {
    return csrf
  },
  mounted: () => !!csrf,
  set token(data) {
    Token.secret = data
  },
  get token() {
    return Token.secret
  },
  deleteCsrf() {
    csrf = undefined
    return this
  },
  deleteToken() {
    Token.delete()
    return this
  },
  init: function () {
    if (!this.createdAt()) this.renew()
    dispatchSessionInitialised()
    return this
  },
}
