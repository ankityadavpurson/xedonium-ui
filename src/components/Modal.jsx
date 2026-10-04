import { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import useDialogFocus from '../hooks/useDialogFocus'
import useEscapeKey from '../hooks/useEscapeKey'
import Button from './Button'
import CloseIcon from './icons/Close'

const TONES = {
	default: { dot: 'bg-app-soft', title: 'text-app-soft' },
	danger: { dot: 'bg-red-500', title: 'text-red-700 dark:text-red-400' },
}

/**
 * Shared dialog shell: backdrop, focus trap, Escape to close, header with close button.
 * While `busy`, Escape / backdrop / close are ignored so an in-flight action can't lose its result.
 * `dismissible={false}` only ignores Escape / backdrop (e.g. while a nested confirm dialog is open).
 * Pass `as="form"` with `onSubmit` to make the dialog a form.
 */
const Modal = ({
	open,
	onClose,
	title,
	tone = 'default',
	busy = false,
	dismissible = true,
	role = 'dialog',
	describedBy,
	maxWidth = 'max-w-lg',
	className = '',
	as: Container = 'div',
	footer,
	children,
	...containerProps
}) => {
	const dialogRef = useRef(null)
	const titleId = useId()

	// Keep the latest onClose without re-binding the Escape listener every render
	const onCloseRef = useRef(onClose)
	useEffect(() => {
		onCloseRef.current = onClose
	})
	const requestClose = useCallback(() => {
		if (!busy && dismissible) onCloseRef.current()
	}, [busy, dismissible])

	useEscapeKey(open, requestClose)
	useDialogFocus(open, dialogRef)

	if (!open) return null

	const { dot, title: titleClass } = TONES[tone]

	// Portalled to <body> so no ancestor (e.g. the app bar's backdrop-blur, which creates a
	// containing block for fixed elements) can trap the full-screen overlay
	return createPortal(
		<div className="fixed inset-0 z-[var(--xd-z-modal,80)] flex items-center justify-center px-4">
			<div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={requestClose} />
			<Container
				ref={dialogRef}
				role={role}
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={describedBy}
				aria-busy={busy || undefined}
				tabIndex={-1}
				className={`relative z-10 flex max-h-[90vh] w-full min-w-0 flex-col border border-app-border bg-app-card shadow-2xl ${maxWidth} ${className}`}
				{...containerProps}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-app-border px-6 pb-5 pt-6">
					<div className="flex items-center gap-2">
						<span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${dot}`} />
						<h2 id={titleId} className={`text-sm font-semibold uppercase tracking-widest ${titleClass}`}>
							{title}
						</h2>
					</div>
					<Button
						onClick={() => !busy && onCloseRef.current()}
						disabled={busy}
						tooltip="Close dialog"
						aria-label="Close dialog"
						variant="secondary"
					>
						<CloseIcon />
					</Button>
				</div>

				<div className="flex-1 overflow-y-auto">{children}</div>

				{footer && (
					<div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-app-border px-6 pb-6 pt-4">
						{footer}
					</div>
				)}
			</Container>
		</div>,
		document.body
	)
}

export default Modal
