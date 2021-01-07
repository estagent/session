import Events from './events'

export const dispatchUserAuthenticated = detail => {
  window.dispatchEvent(
    new CustomEvent(Events.UserAuthenticated, {detail: detail}),
  )
}

export const dispatchUserSignedOut = () => {
  window.dispatchEvent(new Event(Events.UserSignedOut))
}

export const dispatchUserUnmounted = () => {
  window.dispatchEvent(new Event(Events.UserUnmounted))
}

export const dispatchUserMounted = detail => {
  window.dispatchEvent(new CustomEvent(Events.UserMounted, {detail: detail}))
}

export const dispatchUserUpdated = detail => {
  window.dispatchEvent(new CustomEvent(Events.UserUpdated, {detail: detail}))
}

/**
 * Session events
 */

export const dispatchSessionMounted = () => {
  window.dispatchEvent(new Event(Events.SessionMounted))
}

export const dispatchSessionRefreshed = detail => {
  window.dispatchEvent(
    new CustomEvent(Events.SessionRefreshed, {detail: detail}),
  )
}


export const dispatchSessionInvalidated = () => {
  window.dispatchEvent(new Event(Events.SessionInvalidated))
}


export const dispatchSessionInitialised = () => {
  window.dispatchEvent(new Event(Events.SessionInitialized))
}
export const dispatchSessionCreated = () => {
  window.dispatchEvent(new Event(Events.SessionCreated))
}
export const dispatchSessionDestroyed = () => {
  window.dispatchEvent(new Event(Events.SessionDestroyed))
}
