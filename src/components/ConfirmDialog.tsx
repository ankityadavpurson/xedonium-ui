import type { ReactNode } from 'react'
import Button from './Button'
import type { ButtonVariant } from './buttonClass'
import FanFavicon from './FanFavicon'
import Modal from './Modal'

export interface ConfirmDialogProps {
	open: boolean
	onClose: () => void
	onConfirm: () => void
	title?: ReactNode
	/** `danger` for destructive actions. */
	tone?: 'default' | 'danger'
	/** Shows a spinner on the confirm button and ignores Escape, backdrop and close. */
	busy?: boolean
	confirmLabel?: string
	busyLabel?: string
	/** Disables the confirm button, e.g. until the user types a phrase. */
	confirmDisabled?: boolean
	/** Style of the confirm button; defaults to `danger` for `tone="danger"`, otherwise `default`. */
	confirmVariant?: ButtonVariant
	/** A Tailwind `max-w-*` class for the dialog (default `max-w-md`). */
	maxWidth?: string
	cancelLabel?: string
	error?: ReactNode
	children?: ReactNode
}

/**
 * Confirm / cancel dialog built on Modal. Shows a spinner on the confirm button while `busy`
 * (Escape, backdrop and close are ignored then). Use tone="danger" for destructive actions.
 * `confirmDisabled` disables the confirm button; `maxWidth` widens the dialog (a `max-w-*` class).
 */
const ConfirmDialog = ({
	open,
	onClose,
	onConfirm,
	title,
	tone = 'default',
	busy = false,
	confirmLabel = 'Confirm',
	busyLabel,
	confirmDisabled = false,
	confirmVariant,
	maxWidth = 'max-w-md',
	cancelLabel = 'Cancel',
	error,
	children,
}: ConfirmDialogProps) => (
	<Modal
		open={open}
		onClose={onClose}
		busy={busy}
		title={title}
		tone={tone}
		role={tone === 'danger' ? 'alertdialog' : 'dialog'}
		maxWidth={maxWidth}
		footer={
			<>
				<Button onClick={onClose} disabled={busy} variant="secondary" data-autofocus>
					{cancelLabel}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={busy || confirmDisabled}
					variant={confirmVariant ?? (tone === 'danger' ? 'danger' : 'default')}
				>
					{busy ? (
						<span className="flex items-center gap-1">
							<FanFavicon size={16} /> {busyLabel || confirmLabel}
						</span>
					) : (
						confirmLabel
					)}
				</Button>
			</>
		}
	>
		<div className="flex flex-col gap-3 px-6 py-5 text-sm text-app-text">
			{children}
			{error && (
				<p role="alert" className="text-red-700 dark:text-red-400">
					{error}
				</p>
			)}
		</div>
	</Modal>
)

export default ConfirmDialog
