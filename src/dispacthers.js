import Events from './events'

export const dispatchUserAuthenticated = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserAuthenticated, {detail: detail}))
}

export const dispatchUserSignedOut = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserSignedOut, {detail: detail}))
}

export const dispatchUserMounted = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserMounted, {detail: detail}))
}

export const dispatchUserUpdated = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserUpdated, {detail: detail}))
}

export const dispatchUserRefreshed = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserRefreshed, {detail: detail}))
}

/**
 * Session events
 */

export const dispatchSessionInitialised = () => {
  window.dispatchEvent(new Event(Events.SessionInitialized))
}

export const dispatchSessionCreated = () => {
  window.dispatchEvent(new Event(Events.SessionCreated))
}

export const dispatchSessionMounted = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.SessionMounted, {detail: detail}))
}

export const dispatchSessionRefreshed = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.SessionRefreshed, {detail: detail}))
}

export const dispatchSessionDestroyed = () => {
  window.dispatchEvent(new Event(Events.SessionDestroyed))
}

export const dispatchSessionExpired = () => {
  window.dispatchEvent(new Event(Events.SessionExpired))
}

export const dispatchSessionInvalidated = () => {
  window.dispatchEvent(new Event(Events.SessionInvalidated))
}


