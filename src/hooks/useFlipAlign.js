import { useLayoutEffect, useState } from 'react'

const EDGE = 8 // px kept clear of the viewport edge

// For a panel anchored to one side of its trigger ('start' = left edge, 'end' = right edge):
// returns the side to use, flipping when the preferred one would push the panel off-screen.
const useFlipAlign = (open, panelRef, preferred) => {
	const [flipped, setFlipped] = useState(false)

	useLayoutEffect(() => {
		if (!open) {
			setFlipped(false)
			return
		}
		const panel = panelRef.current
		if (!panel) return
		const rect = panel.getBoundingClientRect()
		const viewport = document.documentElement.clientWidth
		const overflows = preferred === 'end' ? rect.left < EDGE : rect.right > viewport - EDGE
		setFlipped(overflows)
	}, [open, panelRef, preferred])

	if (!flipped) return preferred
	return preferred === 'end' ? 'start' : 'end'
}

export default useFlipAlign
