import axios from 'axios'
import Token from './token'
import {dispatchSessionExpired} from './dispacthers'
import {getIdentifier, getIdentifications} from '@revgaming/device'

const Config = {
  url: null,
  timeout: 20000,
}


const createInstance = () => {
  const identifier = getIdentifier()
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

  if (identifier) {
    headers['Device'] = identifier
    const identifications = getIdentifications()
    if (identifications) {
      headers['X-CreatedAt'] = identifications.createdAt
      headers['X-UpdatedAt'] = identifications.updatedAt
    }
  }

  return axios.create({
    baseURL: config.url,
    timeout: config.timeout,
    withCredentials: true,
    headers: headers,
  })
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
}
