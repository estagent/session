import Session from './session'

let secret


const Config = {
  path: 'tokens',
  storage: 'session',
  storageKey: 'token',
  chipper: 'AES-256-CBC',
  secret: 'csrf',
}

/**
 * TODO: api_token will be encrypted with csrf_token in sessionStorage
 * @param secret
 * @returns {any|null}
 */
const decodeCredentials = secret =>
  typeof secret === 'string' ? JSON.parse(atob(secret)) : null

const encodeCredentials = data =>
  typeof data === 'object' ? btoa(JSON.stringify(data)) : null

const validateSecret = secret =>
  typeof secret === 'string' && secret.length > 16

const validateExpiry = expiresAt =>
  typeof expiresAt === 'number' && expiresAt > Date.now()

const getCredentials = () => Session.get(Config.storageKey)
const saveCredentials = string => Session.set(Config.storageKey, string)

const removeToken = () => {
  Session.remove(Config.storageKey)
}

const getSecret = () => {
  const secret = getCredentials()
  if (secret) {
    const data = decodeCredentials(secret)
    if (data) {
      if (validateSecret(data.secret) && validateExpiry(data.expiresAt))
        return data.secret
      else {
        removeToken()
        return null
      }
    }
  }
}

const setToken = data => {
  if (typeof data !== 'object') throw 'input must be object'
  if (validateSecret(data.secret) !== true) throw 'token is not valid'
  if (validateExpiry(data.expiresAt) !== true) throw 'token expired'
  saveCredentials(encodeCredentials(data))
}

export default {
  get secret() {
    if (!secret) secret = getSecret()
    return secret
  },
  set secret(data) {
    setToken(data)
    secret = data.secret
  },
  delete: () => {
    secret = undefined
    removeToken()
  },
  config(obj) {
    for (let key of Object.keys(obj))
      if (Config.hasOwnProperty(key)) Config[key] = obj[key]
      else throw `unknown token config option (${key})`
    return this
  },
}
