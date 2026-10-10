import { useLayoutEffect, useState, type RefObject } from 'react'

const EDGE = 8 // px kept clear of the viewport edge

// For a panel anchored to one side of its trigger ('start' = left edge, 'end' = right edge):
// returns the side to use, flipping when the preferred one would push the panel off-screen and the other side fits better.
const useFlipAlign = (
	open: boolean,
	panelRef: RefObject<HTMLElement | null>,
	preferred: 'start' | 'end'
): 'start' | 'end' => {
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
		const overflowOf = (left: number, right: number) =>
			Math.max(0, EDGE - left) + Math.max(0, right - (viewport - EDGE))
		const overflow = overflowOf(rect.left, rect.right)
		const anchor = panel.offsetParent?.getBoundingClientRect()
		if (overflow === 0 || !anchor) {
			setFlipped(overflow > 0)
			return
		}
		// Flip only when the other side is better: lined up with the opposite edge of the anchor, the panel keeps its width
		const width = rect.right - rect.left
		const other =
			preferred === 'end'
				? overflowOf(anchor.left, anchor.left + width)
				: overflowOf(anchor.right - width, anchor.right)
		setFlipped(other < overflow)
	}, [open, panelRef, preferred])

	if (!flipped) return preferred
	return preferred === 'end' ? 'start' : 'end'
}

export default useFlipAlign
