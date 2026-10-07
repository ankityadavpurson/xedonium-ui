import { useEffect, useState } from 'react'

const getMatch = (query: string) => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches

/** Tracks whether a CSS media query matches, e.g. `useMediaQuery('(min-width: 1024px)')`. */
const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(() => getMatch(query))

	useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) return undefined
		const list = window.matchMedia(query)
		const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
		setMatches(list.matches)
		list.addEventListener('change', onChange)
		return () => list.removeEventListener('change', onChange)
	}, [query])

	return matches
}

export default useMediaQuery
