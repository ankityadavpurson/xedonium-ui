import { useEffect } from 'react'

const useEscapeKey = (enabled: boolean, onEscape: () => void) => {
	useEffect(() => {
		if (!enabled) return undefined

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onEscape()
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [enabled, onEscape])
}

export default useEscapeKey
