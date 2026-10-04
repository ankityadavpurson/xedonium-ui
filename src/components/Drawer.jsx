import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import useDialogFocus from '../hooks/useDialogFocus'
import useEscapeKey from '../hooks/useEscapeKey'
import Button from './Button'
import CloseIcon from './icons/Close'

const SIDES = { right: 'right-0 border-l', left: 'left-0 border-r' }

/** Side panel dialog: backdrop, focus trap, Escape / backdrop to close. side: right | left. */
const Drawer = ({ open, onClose, title, side = 'right', width = 'max-w-md', footer, children }) => {
	const ref = useRef(null)
	const titleId = useId()
	useEscapeKey(open, onClose)
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
			<div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
			<aside
				ref={ref}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				className={`absolute inset-y-0 flex w-full flex-col border-app-border bg-app-card shadow-2xl ${SIDES[side]} ${width}`}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-app-border px-6 py-4">
					<h2 id={titleId} className="text-sm font-semibold uppercase tracking-widest text-app-soft">
						{title}
					</h2>
					<Button onClick={onClose} tooltip="Close" aria-label="Close" variant="secondary">
						<CloseIcon />
					</Button>
				</div>
				<div className="flex-1 overflow-y-auto p-6">{children}</div>
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
