import {
	useCallback,
	useEffect,
	useId,
	useRef,
	type ComponentPropsWithoutRef,
	type ElementType,
	type ReactNode,
	type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import useDialogFocus from '../hooks/useDialogFocus'
import useEscapeKey from '../hooks/useEscapeKey'
import Button from './Button'
import CloseIcon from './icons/Close'

// Form attributes that apply when `as="form"`; they are passed through to the dialog element
type FormPassThrough = Pick<
	ComponentPropsWithoutRef<'form'>,
	'noValidate' | 'autoComplete' | 'action' | 'method' | 'encType' | 'target' | 'acceptCharset'
>

export interface ModalProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'>, FormPassThrough {
	open: boolean
	onClose: () => void
	title?: ReactNode
	tone?: 'default' | 'danger'
	/** Ignore Escape, backdrop and close while an action is in flight. */
	busy?: boolean
	/** `false` only ignores Escape and backdrop. */
	dismissible?: boolean
	role?: 'dialog' | 'alertdialog'
	/** `id` of the element that describes the dialog. */
	describedBy?: string
	/** A Tailwind `max-w-*` class. */
	maxWidth?: string
	/** Element to focus when the dialog opens (default: the one marked `data-autofocus`, else the first control). */
	initialFocusRef?: RefObject<HTMLElement | null>
	/** Fill the screen (no margin, border or max width) below this breakpoint, e.g. for long forms on phones. */
	fullScreenBelow?: 'sm' | 'md'
	/** Element to render; `form` with `onSubmit` makes the dialog a form. */
	as?: ElementType
	footer?: ReactNode
}

const FULL_SCREEN: Record<'sm' | 'md', { wrapper: string; dialog: string }> = {
	sm: { wrapper: 'max-sm:px-0', dialog: 'max-sm:h-[100dvh] max-sm:max-h-none max-sm:max-w-none max-sm:border-0' },
	md: { wrapper: 'max-md:px-0', dialog: 'max-md:h-[100dvh] max-md:max-h-none max-md:max-w-none max-md:border-0' },
}

const TONES: Record<'default' | 'danger', string> = {
	default: 'text-app-soft',
	danger: 'text-red-700 dark:text-red-400',
}

/**
 * Shared dialog shell: backdrop, focus trap, Escape to close, header with close button.
 * While `busy`, Escape / backdrop / close are ignored so an in-flight action can't lose its result.
 * `dismissible={false}` only ignores Escape / backdrop (e.g. while a nested confirm dialog is open).
 * On open, focus goes to `initialFocusRef`, else an element with `data-autofocus`, else the first control (the Close
 * button). Pass `as="form"` with `onSubmit` to make the dialog a form; `noValidate`, `autoComplete`, `action`, `method` and the
 * like are passed through to it. `fullScreenBelow="sm"` fills the screen on phones.
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
	fullScreenBelow,
	initialFocusRef,
	className = '',
	as: Container = 'div',
	footer,
	children,
	...containerProps
}: ModalProps) => {
	const dialogRef = useRef<HTMLElement>(null)
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
	useDialogFocus(open, dialogRef, initialFocusRef)

	if (!open) return null

	const titleClass = TONES[tone]

	// Portalled to <body> so no ancestor (e.g. the app bar's backdrop-blur, which creates a
	// containing block for fixed elements) can trap the full-screen overlay
	return createPortal(
		<div
			className={`fixed inset-0 z-[var(--xd-z-modal,80)] flex items-center justify-center px-4 ${fullScreenBelow ? FULL_SCREEN[fullScreenBelow].wrapper : ''}`}
		>
			<div aria-hidden="true" className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={requestClose} />
			<Container
				ref={dialogRef}
				role={role}
				aria-modal="true"
				aria-labelledby={titleId}
				aria-describedby={describedBy}
				aria-busy={busy || undefined}
				tabIndex={-1}
				className={`relative z-10 flex max-h-[90vh] w-full min-w-0 flex-col border border-app-border bg-app-card shadow-2xl ${maxWidth} ${fullScreenBelow ? FULL_SCREEN[fullScreenBelow].dialog : ''} ${className}`}
				{...containerProps}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-app-border px-6 pb-5 pt-6">
					<div className="flex items-center gap-2">
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
