import axios from 'axios'
import Token from './token'
import {dispatchSessionExpired} from './dispacthers'
import {updateHeadersWithIdentifications} from '@revgaming/identity'

const Config = {
  url: null,
  timeout: 20000,
  withCredentials: true,
  withIdentifier: false,
  withIdentificationTimestamps: false,
}

const createInstance = () => {

  const csrf = Token.csrf
  const authorization = Token.secret

  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
  }
  if (csrf) {
    headers['X-CSRF-TOKEN'] = csrf
  }
  if (authorization) {
    headers['Authorization'] = 'Bearer '.concat(authorization)
  }
  return axios.create({
      baseURL: Config.url,
      timeout: Config.timeout,
      withCredentials: Config.withCredentials,
      headers: updateHeadersWithIdentifications(headers, {
        identifier: Config.withIdentifier,
        timestamps: Config.withIdentificationTimestamps,
      }),
    },
  )
}

const get = path => {
  return createInstance()
    .get(path, {})
    .then(response => {
      return response.data
    })
}

const post = (path, data) => {
  return createInstance()
    .post(path, data)
    .then(response => {
      return response.data
    })
    .catch(error => checkCsrfError(error))
}

const put = (path, data) => {
  return createInstance()
    .put(path, data)
    .then(response => {
      return response.data
    })
    .catch(error => checkCsrfError(error))
}

const deleteReq = (path) => {
  return createInstance()
    .delete(path)
    .then(response => {
      return response.data
    })
    .catch(error => checkCsrfError(error))
}


const checkCsrfError = (error) => {
  if (error.response.status === 419)
    dispatchSessionExpired()
  throw error
}

export default {
  get: get,
  post: post,
  put: put,
  delete: deleteReq,
  timeout(timeout) {
    Config.timeout = timeout
    return this
  },
  url(url) {
    Config.url = url
    return this
  },
  withIdentifier(value = true) {
    Config.withIdentifier = value
    return this
  },
  withIdentificationTimestamps(value = true) {
    Config.withIdentificationTimestamps = value
    return this
  },
  config(obj) {
    for (let key of Object.keys(obj))
      if (Config.hasOwnProperty(key))
        Config[key] = obj[key]
      else throw `unknown xhr config option (${key})`
    return this
  },
}
