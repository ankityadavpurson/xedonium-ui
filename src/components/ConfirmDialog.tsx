import type { ReactNode } from 'react'
import Button from './Button'
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
	cancelLabel?: string
	error?: ReactNode
	children?: ReactNode
}

/**
 * Confirm / cancel dialog built on Modal. Shows a spinner on the confirm button while `busy`
 * (Escape, backdrop and close are ignored then). Use tone="danger" for destructive actions.
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
		maxWidth="max-w-md"
		footer={
			<>
				<Button onClick={onClose} disabled={busy} variant="secondary" data-autofocus>
					{cancelLabel}
				</Button>
				<Button onClick={onConfirm} disabled={busy} variant={tone === 'danger' ? 'danger' : 'default'}>
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
