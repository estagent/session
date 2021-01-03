import Session from './session'

let secret
let csrf

const authKey = '__api__'

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


const getCredentials = () => Session.get(authKey)
const saveCredentials = string => Session.set(authKey, string)

const removeToken = () => {
  Session.remove(authKey)
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

const setToken = (data) => {
  if (typeof data !== 'object')
    throw 'input must be object'
  if (validateSecret(data.secret) !== true) throw 'token is not valid'
  if (validateExpiry(data.expiresAt) !== true) throw 'token expired'
  saveCredentials(encodeCredentials(data))
}


export default {
  get secret() {
    if (!secret)
      secret = getSecret()
    return secret
  },
  set secret(data) {
    if (data === null || data === undefined) {
      this.delete()
    } else {
      setToken(data)
      secret = data.secret
    }
  },
  set csrf(string) {
    csrf = string
  },
  get csrf() {
    return csrf
  },
  delete: () => {
    csrf = undefined
    secret = undefined
    removeToken()
  },
}
