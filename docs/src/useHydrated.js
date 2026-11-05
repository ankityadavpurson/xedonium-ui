import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False while the server renders and while the browser hydrates that markup, true from the next render on.
 * Wrap anything that reads the visitor's theme (stored choice, device setting) in it: the prerendered page cannot know
 * them, and a first client render that differs from the HTML leaves stale attributes behind.
 */
const useHydrated = () =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	)

export default useHydrated
