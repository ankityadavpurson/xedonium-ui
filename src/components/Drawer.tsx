import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import useDialogFocus from '../hooks/useDialogFocus'
import useEscapeKey from '../hooks/useEscapeKey'
import Button from './Button'
import Loader from './Loader'
import CloseIcon from './icons/Close'

export interface DrawerProps {
	open: boolean
	onClose: () => void
	title?: ReactNode
	/** The edge it opens from. */
	side?: DrawerSide
	/** For `left` / `right`: a Tailwind `max-w-*` class. */
	width?: string
	/** For `top` / `bottom`: a Tailwind `max-h-*` class. */
	height?: string
	/** Slide in and fade the backdrop on open, and slide out on close (default false: it appears and disappears at once). */
	animated?: boolean
	/** `false` removes the body padding so the content fills and scrolls itself. */
	padded?: boolean
	footer?: ReactNode
	/** Element to focus when the drawer opens (default: the one marked `data-autofocus`, else the first control). */
	initialFocusRef?: RefObject<HTMLElement | null>
	/** Ignore Escape, backdrop and close while an action is in flight (like `Modal`). */
	busy?: boolean
	/** With `busy`, also cover the body with a dimmed overlay and a spinner. */
	busyOverlay?: boolean
	children?: ReactNode
}

export type DrawerSide = 'right' | 'left' | 'top' | 'bottom'

const SIDES: Record<DrawerSide, string> = {
	right: 'inset-y-0 right-0 border-l',
	left: 'inset-y-0 left-0 border-r',
	top: 'inset-x-0 top-0 border-b',
	bottom: 'inset-x-0 bottom-0 border-t',
}

// where the panel waits while it is closed, when animated
const OFFSCREEN: Record<DrawerSide, string> = {
	right: 'translate-x-full',
	left: '-translate-x-full',
	top: '-translate-y-full',
	bottom: 'translate-y-full',
}

// keep in step with `duration-200` below
const ANIMATION_MS = 200

/**
 * Panel dialog: backdrop, focus trap, Escape / backdrop to close. side: right | left | top | bottom (`width` sizes the
 * side panels, `height` the top and bottom ones). `animated` slides it in and out.
 * On open, focus goes to `initialFocusRef`, else an element with `data-autofocus`, else the first control (the Close
 * button).
 * While `busy`, Escape / backdrop / close are ignored; `busyOverlay` also covers the body with a spinner.
 * `padded={false}` removes the body padding and lets the content fill (and scroll) itself, e.g. a Sidebar.
 */
const Drawer = ({
	open,
	onClose,
	title,
	side = 'right',
	width = 'max-w-md',
	height = 'max-h-[60vh]',
	animated = false,
	padded = true,
	footer,
	initialFocusRef,
	busy = false,
	busyOverlay = false,
	children,
}: DrawerProps) => {
	const ref = useRef<HTMLElement>(null)
	const titleId = useId()
	// Keep the latest onClose without re-binding the Escape listener every render
	const onCloseRef = useRef(onClose)
	useEffect(() => {
		onCloseRef.current = onClose
	})
	const requestClose = useCallback(() => {
		if (!busy) onCloseRef.current()
	}, [busy])

	// When animated, the drawer stays mounted for the slide-out: `closing` covers that gap, `entered` drives the slide-in
	const [closing, setClosing] = useState(false)
	const [wasOpen, setWasOpen] = useState(open)
	if (open !== wasOpen) {
		setWasOpen(open)
		setClosing(animated && !open)
	}
	const [entered, setEntered] = useState(false)
	useEffect(() => {
		if (!animated || !open) {
			setEntered(false)
			return undefined
		}
		// two frames: the first paint has to happen at the off-screen position for the transition to run
		let second = 0
		const first = requestAnimationFrame(() => {
			second = requestAnimationFrame(() => setEntered(true))
		})
		return () => {
			cancelAnimationFrame(first)
			cancelAnimationFrame(second)
		}
	}, [animated, open])
	useEffect(() => {
		if (!closing) return undefined
		const timer = setTimeout(() => setClosing(false), ANIMATION_MS)
		return () => clearTimeout(timer)
	}, [closing])
	const rendered = open || closing
	const shown = !animated || (open && entered)

	useEscapeKey(open, requestClose)
	useDialogFocus(open, ref, initialFocusRef)

	// Lock page scroll while open
	useEffect(() => {
		if (!rendered) return undefined
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [rendered])

	if (!rendered) return null

	const vertical = side === 'top' || side === 'bottom'

	return createPortal(
		<div className={`fixed inset-0 z-[var(--xd-z-modal,80)] ${open ? '' : 'pointer-events-none'}`}>
			<div
				aria-hidden="true"
				className={`absolute inset-0 bg-black/30 backdrop-blur-sm ${
					animated ? `transition-opacity duration-200 ease-out ${shown ? 'opacity-100' : 'opacity-0'}` : ''
				}`}
				onClick={requestClose}
			/>
			<aside
				ref={ref}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-busy={busy || undefined}
				tabIndex={-1}
				className={`absolute flex w-full flex-col border-app-border bg-app-card shadow-2xl ${SIDES[side]} ${
					vertical ? height : width
				} ${animated ? `transition-transform duration-200 ease-out ${shown ? 'translate-x-0 translate-y-0' : OFFSCREEN[side]}` : ''}`}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-app-border px-6 py-4">
					<h2 id={titleId} className="text-sm font-semibold uppercase tracking-widest text-app-soft">
						{title}
					</h2>
					<Button onClick={requestClose} disabled={busy} tooltip="Close" aria-label="Close" variant="secondary">
						<CloseIcon />
					</Button>
				</div>
				<div className={`relative min-h-0 flex-1 ${padded ? 'overflow-y-auto p-6' : 'flex flex-col'}`}>
					{children}
					{busy && busyOverlay && (
						<div className="absolute inset-0 flex items-center justify-center bg-app-card/70">
							<Loader variant="spinner" label="Loading" />
						</div>
					)}
				</div>
				{footer && (
					<div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-app-border px-6 py-4">
						{footer}
					</div>
				)}
			</aside>
		</div>,
		document.body
	)
}

export default Drawer
