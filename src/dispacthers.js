import Events from './events'

export const dispatchUserAuthenticated = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserAuthenticated, {detail: detail}))
}

export const dispatchUserSignedOut = () => {
  window.dispatchEvent(new Event(Events.UserSignedOut))
}

export const dispatchUserMounted = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserMounted, {detail: detail}))
}

export const dispatchUserUpdated = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.UserUpdated, {detail: detail}))
}

/**
 * Session events
 */


export const dispatchSessionMounted = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.SessionMounted, {detail: detail}))
}

export const dispatchSessionRefreshed = (detail) => {
  window.dispatchEvent(new CustomEvent(Events.SessionRefreshed, {detail: detail}))
}

export const dispatchSessionExpired = () => {
  window.dispatchEvent(new Event(Events.SessionExpired))
}

export const dispatchSessionInvalidated = () => {
  window.dispatchEvent(new Event(Events.SessionInvalidated))
}


/**
 * #IMPORTANT:
 * session initialization must be dispatch first! during create and destroy! session not initlied
 */
export const dispatchSessionInitialised = () => {
  window.dispatchEvent(new Event(Events.SessionInitialized))
}
export const dispatchSessionCreated = () => {
  window.addEventListener(Events.SessionInitialized, () => window.dispatchEvent(new Event(Events.SessionCreated)), {once: true})
}
export const dispatchSessionDestroyed = () => {
  window.addEventListener(Events.SessionInitialized, () => window.dispatchEvent(new Event(Events.SessionDestroyed)), {once: true})
}

