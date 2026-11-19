import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * A value that can only be read in the browser (`window.devicePixelRatio`, `navigator.onLine`...).
 * A client-only render gets the real value at once; a server render, and the client's hydration of it, get
 * `serverValue`, so the markup matches, and the real value follows right after. `read` must return a primitive (or
 * another stable value), because React compares it between renders.
 */
const useClientValue = <T>(read: () => T, serverValue: T): T => useSyncExternalStore(subscribe, read, () => serverValue)

export default useClientValue
