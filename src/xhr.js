import {addHeadersFromIdentities, getIdentity} from '@revgaming/identity'
import axios from 'axios'
import {Session} from './index'

const checkCsrfError = err => {
  if (err.response) {
    if (err.response.status === 419) Session.expire()
  } else console.error(err)

  throw err
}

const createInstance = opts => {
  const config = opts.config || {}

  if (!config.hasOwnProperty('headers')) config.headers = {}

  const addHeader = (h, val) => {
    if (h instanceof Object) {
      for (let key of Object.keys(h)) addHeader(key, h[key])
    }
    config.headers[h] = val
  }

  if (opts.hasOwnProperty('xmlHttp') && opts.xmlHttp)
    addHeader('X-Requested-With', 'XMLHttpRequest')

  if (opts.hasOwnProperty('csrf') && opts.csrf && Session.csrf)
    addHeader('X-CSRF-TOKEN', Session.csrf)

  if (
    opts.hasOwnProperty('authorization') &&
    opts.authorization &&
    Session.token
  )
    addHeader('Authorization', 'Bearer '.concat(Session.token))

  if (opts.hasOwnProperty('identity') && opts.identity)
    addHeader(
      typeof opts.identity === 'string' ? opts.identity : 'X-IDENTITY',
      getIdentity(),
    )
  else if (opts.hasOwnProperty('identities') && opts.identities)
    addHeader(addHeadersFromIdentities(opts.identities))

  const instance = axios.create(config)
  instance.interceptors.response.use(response => response, checkCsrfError)
  return instance
}

export default function (opts = {}) {
  // if (!opts.hasOwnProperty('config')) opts.config = {}
  // if (!opts.config.hasOwnProperty('headers')) opts.config.headers = {}

  // const config = (key,val) => {
  //   opts.config[key] = val
  // }
  //
  // const addHeader = (h, val) => {
  //   if (h instanceof Object) {
  //     for (let key of Object.keys(h)) addHeader(key, h[key])
  //   }
  //   opts.config.headers[h] = val
  // }

  const get = (path, config) => {
    return createInstance(opts)
      .get(path, config)
      .then(response => {
        return response.data
      })
  }
  const post = (path, data, config) => {
    return createInstance(opts)
      .post(path, data, config)
      .then(response => {
        return response.data
      })
  }
  const put = (path, data, config) => {
    return createInstance(opts)
      .put(path, data, config)
      .then(response => {
        return response.data
      })
  }
  const deleteReq = (path, config) => {
    return createInstance(opts)
      .delete(path, config)
      .then(response => {
        return response.data
      })
  }

  return {
    get: get,
    post: post,
    put: put,
    delete: deleteReq,
    // addHeader: addHeader,
    // url: url => config('baseURL',url),
    // timeout: timeout => config('timeout',timeout),
    // asXMLHttp: bool => (opts.xmlHttp = bool),
    // withCsrfToken: bool => (opts.csrf = bool),
    // withCredentials: bool => (opts.credentials = bool),
    // withAuthorization: bool => (opts.authorization = bool),
    // withIdentities: identities => (opts.identities = identities),
    // withIdentity: mixed => (opts.identity = mixed),
  }
}
