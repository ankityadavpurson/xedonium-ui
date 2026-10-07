import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react'
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
	side?: 'right' | 'left'
	/** A Tailwind `max-w-*` class. */
	width?: string
	/** `false` removes the body padding so the content fills and scrolls itself. */
	padded?: boolean
	footer?: ReactNode
	/** Ignore Escape, backdrop and close while an action is in flight (like `Modal`). */
	busy?: boolean
	/** With `busy`, also cover the body with a dimmed overlay and a spinner. */
	busyOverlay?: boolean
	children?: ReactNode
}

const SIDES: Record<'right' | 'left', string> = { right: 'right-0 border-l', left: 'left-0 border-r' }

/**
 * Side panel dialog: backdrop, focus trap, Escape / backdrop to close. side: right | left.
 * While `busy`, Escape / backdrop / close are ignored; `busyOverlay` also covers the body with a spinner.
 * `padded={false}` removes the body padding and lets the content fill (and scroll) itself, e.g. a Sidebar.
 */
const Drawer = ({
	open,
	onClose,
	title,
	side = 'right',
	width = 'max-w-md',
	padded = true,
	footer,
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

	useEscapeKey(open, requestClose)
	useDialogFocus(open, ref)

	// Lock page scroll while open
	useEffect(() => {
		if (!open) return undefined
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = previous
		}
	}, [open])

	if (!open) return null

	return createPortal(
		<div className="fixed inset-0 z-[var(--xd-z-modal,80)]">
			<div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={requestClose} />
			<aside
				ref={ref}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				aria-busy={busy || undefined}
				tabIndex={-1}
				className={`absolute inset-y-0 flex w-full flex-col border-app-border bg-app-card shadow-2xl ${SIDES[side]} ${width}`}
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
