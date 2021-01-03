import Request from './request'
import Token from './token'
import Session from './session'
import {dispatchUserMounted, dispatchSessionRefreshed, dispatchSessionMounted, dispatchUserUpdated} from './dispacthers'

let refreshInterval

const refreshSession = () => {
  Request.put('session/'.concat(Date.now().toString()))
    .then(data => dispatchSessionRefreshed(data))
    .then((data) => {
      if (data.hasOwnProperty('user')) {
        const newUser = data.user
        const user = Session.user()
        if (user.updatedAt !== newUser.updatedAt) {
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
  Request.get('session').then(data => {
    if (!data.hasOwnProperty('csrf') || typeof data.csrf !== 'string') throw 'csrf not found in response'
    Token.csrf = data.csrf
    dispatchSessionMounted(data)
    if (data.hasOwnProperty('auth') || data.auth === true) {
      if (!data.hasOwnProperty('user') || typeof data.user !== 'object') throw 'user not found in response'
      Session.authenticated(data.user)
      dispatchUserMounted(data)
    }
    if (!refreshInterval) refreshInterval = setInterval(refreshSession, 10000)
  })
}







