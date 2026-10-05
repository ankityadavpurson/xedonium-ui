import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { computePosition } from '../utils/position'

const GAP = 6 // px between trigger and tooltip

// Replaces the native `title` attribute. Shows `text` next to the child on hover or keyboard focus
// (:focus-visible, so focus restored after a mouse-closed dialog doesn't reopen it).
// Rendered into <body> with fixed positioning so dialogs and scroll containers can't clip it;
// `placement` is top | bottom | left | right | auto (default bottom), optionally with -start / -end; the tooltip
// flips to the opposite side when there is no room and always stays inside the viewport.
// Hover is tracked on the wrapper, so it also works for disabled buttons.
// `className` styles the wrapper (e.g. to position it where the bare button used to sit).
const Tooltip = ({ text, children, placement = 'bottom', className = '' }) => {
	const id = useId()
	const triggerRef = useRef(null)
	const tipRef = useRef(null)
	const [open, setOpen] = useState(false)
	const [position, setPosition] = useState(null)

	const show = () => setOpen(true)
	const hide = () => {
		setOpen(false)
		setPosition(null)
	}

	useLayoutEffect(() => {
		if (!open || !triggerRef.current || !tipRef.current) return
		const trigger = triggerRef.current.getBoundingClientRect()
		const tip = tipRef.current.getBoundingClientRect()
		const { top, left } = computePosition(trigger, tip, { placement, gap: GAP })
		setPosition({ top, left })
	}, [open, text, placement])

	// Dismissible (Escape) and never left floating after the page moves
	useEffect(() => {
		if (!open) return undefined
		const onKeyDown = event => event.key === 'Escape' && hide()
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('scroll', hide, true)
		window.addEventListener('resize', hide)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
			window.removeEventListener('scroll', hide, true)
			window.removeEventListener('resize', hide)
		}
	}, [open])

	if (!text) return children

	// Icon buttons already carry the same text as aria-label; don't make screen readers say it twice
	const describe = children.props['aria-label'] !== text

	return (
		<span
			ref={triggerRef}
			// A disabled child ignores the pointer so hover always lands on the wrapper (some browsers
			// don't fire mouse events for disabled elements); the wrapper keeps the not-allowed cursor
			className={`inline-flex [&>:disabled]:pointer-events-none has-[>:disabled]:cursor-not-allowed ${className}`}
			onMouseEnter={show}
			onMouseLeave={hide}
			onFocus={event => event.target.matches(':focus-visible') && show()}
			onBlur={hide}
			onPointerDown={hide}
		>
			{describe ? cloneElement(children, { 'aria-describedby': id }) : children}
			{describe && (
				<span id={id} hidden>
					{text}
				</span>
			)}
			{open &&
				createPortal(
					<div
						ref={tipRef}
						aria-hidden="true"
						style={{ top: position?.top ?? 0, left: position?.left ?? 0, visibility: position ? 'visible' : 'hidden' }}
						className="pointer-events-none fixed z-[var(--xd-z-tooltip,100)] w-max max-w-[16rem] border border-app-border bg-app-card px-2.5 py-1.5 text-xs normal-case tracking-normal text-app-text shadow-xl"
					>
						{text}
					</div>,
					document.body
				)}
		</span>
	)
}

export default Tooltip
