import { useCallback, useSyncExternalStore } from 'react'

const getMatch = (query: string) => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches

/**
 * Tracks whether a CSS media query matches, e.g. `useMediaQuery('(min-width: 1024px)')`.
 * On a server it is `false`, and so is the client's first (hydrating) render, so the markup matches; the real
 * value follows right after. Without server rendering it is correct from the first render.
 */
const useMediaQuery = (query: string): boolean => {
	const subscribe = useCallback(
		(onChange: () => void) => {
			if (typeof window === 'undefined' || !window.matchMedia) return () => {}
			const list = window.matchMedia(query)
			list.addEventListener('change', onChange)
			return () => list.removeEventListener('change', onChange)
		},
		[query]
	)
	return useSyncExternalStore(
		subscribe,
		() => getMatch(query),
		() => false
	)
}

export { useMediaQuery }
export default useMediaQuery
