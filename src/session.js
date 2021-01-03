import {dispatchSessionCreated, dispatchSessionDestroyed, dispatchSessionInitialised} from './dispacthers'

export default {
  createdAt: function() {
    const createdAt = this.get('createdAt')
    if (createdAt)
      return parseInt(createdAt)
  },
  seconds: function() {
    return Date.now() - this.get('createdAt')
  },
  clear: function() {
    console.log('session cleared!')
    sessionStorage.clear()
    dispatchSessionDestroyed()
    return this
  },
  renew: function() {
    this.clear().set('createdAt', Date.now())
    dispatchSessionCreated()
  },
  set: function(key, val) {
    sessionStorage.setItem(key, val instanceof Object ? JSON.stringify(val) : val)
    sessionStorage.setItem('updatedAt', Date.now().toString())
    return this
  },
  remove: function(key) {
    sessionStorage.removeItem(key)
    return this
  },
  get: function(key) {
    return sessionStorage.getItem(key)
  },
  isAuthenticated: function() {
    return JSON.parse(this.get('auth')) === true
  },
  authenticated: function(user) {
    if (typeof user !== 'object') throw 'invalid user input'
    this.set('auth', true)
    this.set('user', JSON.stringify(user))
  },
  guest: function() {
    this.remove('user')
    this.set('auth', false)
  },
  user: function() {
    if (this.get('auth') !== true) return null
    return JSON.parse(this.get('user'))
  },
  init: function() {
    if (!this.createdAt()) this.renew()
    dispatchSessionInitialised()
    return this
  },
}
