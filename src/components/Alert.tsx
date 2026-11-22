import type { ReactNode } from 'react'
import type { Tone } from '../types'
import SOLID_TONES from '../utils/solidTones'
import CloseIcon from './icons/Close'
import InfoIcon from './icons/Info'

export interface AlertProps {
	tone?: Tone
	/** `soft` (default) tints the background; `solid` is opaque, so it stays readable over images and patterns. */
	variant?: 'soft' | 'solid'
	title?: ReactNode
	/** Makes the alert dismissible. */
	onClose?: () => void
	icon?: ReactNode
	className?: string
	children?: ReactNode
}

const SOFT_TONES: Record<Tone, string> = {
	info: 'border-app-border bg-app-card text-app-text',
	success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
	warning: 'border-amber-500/50 bg-amber-400/15 text-amber-900 dark:text-amber-200',
	danger: 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300',
}

/**
 * Inline message. tone: info | success | warning | danger. Pass `onClose` to make it dismissible.
 * variant: soft (default, a translucent tint) | solid (opaque, the same colors as Toast; use it over images or patterns).
 */
const Alert = ({ tone = 'info', variant = 'soft', title, onClose, icon, className = '', children }: AlertProps) => (
	<div
		role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
		className={`flex items-start gap-3 border px-4 py-3 text-sm ${
			variant === 'solid' ? `border-transparent ${SOLID_TONES[tone]}` : SOFT_TONES[tone]
		} ${className}`}
	>
		<span className="mt-0.5 shrink-0">{icon ?? <InfoIcon className="h-4 w-4" />}</span>
		<div className="min-w-0 flex-1">
			{title && <div className="font-semibold">{title}</div>}
			{children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
		</div>
		{onClose && (
			<button
				type="button"
				onClick={onClose}
				aria-label="Dismiss"
				className="-m-2 shrink-0 p-2 opacity-70 transition hover:opacity-100"
			>
				<CloseIcon className="h-4 w-4" />
			</button>
		)}
	</div>
)

export { Alert }
export default Alert
