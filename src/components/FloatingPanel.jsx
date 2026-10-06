import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { computePosition, isClipped } from '../utils/position'
import portalTarget from '../utils/portalTarget'

/**
 * A panel positioned next to `anchorRef`'s element, rendered into <body> (or the fullscreen element, so it shows in fullscreen) with fixed positioning so no
 * ancestor (overflow: hidden, transforms, dialogs) can clip it. It flips to the opposite side when there is
 * no room, stays inside the viewport and follows the anchor on scroll and resize.
 *
 * placement: top | bottom | left | right | auto, optionally with -start / -end (e.g. "bottom-end").
 * `matchWidth` makes the panel at least as wide as the anchor. Pass `panelRef` to read the element.
 */
const FloatingPanel = ({
	open,
	anchorRef,
	placement = 'bottom-start',
	gap = 4,
	matchWidth = false,
	panelRef,
	className = '',
	style,
	children,
	...rest
}) => {
	const ownRef = useRef(null)
	const ref = panelRef ?? ownRef
	const [position, setPosition] = useState(null)
	const updateRef = useRef(null)
	const lastPosition = useRef(null)

	useLayoutEffect(() => {
		if (!open) {
			lastPosition.current = null
			setPosition(null)
			return undefined
		}
		const update = () => {
			const anchor = anchorRef.current?.getBoundingClientRect()
			const panel = ref.current
			if (!anchor || !panel) return
			const next = {
				...computePosition(anchor, { width: panel.offsetWidth, height: panel.offsetHeight }, { placement, gap }),
				width: matchWidth ? anchor.width : undefined,
				// the anchor was scrolled out of view: hide rather than hover over unrelated content
				hidden: isClipped(anchorRef.current),
			}
			// Compare against the last value we set (not via a setState updater): this also runs after every render,
			// and an updater function would schedule another render each time even when nothing changed
			const prev = lastPosition.current
			if (
				prev &&
				Object.is(prev.top, next.top) &&
				Object.is(prev.left, next.left) &&
				Object.is(prev.width, next.width) &&
				prev.hidden === next.hidden
			)
				return
			lastPosition.current = next
			setPosition(next)
		}
		updateRef.current = update
		update()
		window.addEventListener('scroll', update, true)
		window.addEventListener('resize', update)
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
		if (observer && ref.current) observer.observe(ref.current)
		return () => {
			updateRef.current = null
			window.removeEventListener('scroll', update, true)
			window.removeEventListener('resize', update)
			observer?.disconnect()
		}
	}, [open, anchorRef, ref, placement, gap, matchWidth])

	// The anchor can move without a scroll or resize (e.g. a slider thumb), so re-measure after every render
	useLayoutEffect(() => {
		updateRef.current?.()
	})

	if (!open) return null

	return createPortal(
		<div
			ref={ref}
			{...rest}
			style={{
				position: 'fixed',
				top: position?.top ?? 0,
				left: position?.left ?? 0,
				minWidth: position?.width,
				// invisible (but focusable) until measured, so children can take focus on mount; also hidden while scrolled out
				opacity: position && !position.hidden ? 1 : 0,
				pointerEvents: position && !position.hidden ? undefined : 'none',
				...style,
			}}
			className={`z-[var(--xd-z-popover,85)] ${className}`}
		>
			{children}
		</div>,
		portalTarget()
	)
}

export default FloatingPanel
