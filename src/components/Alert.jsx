import CloseIcon from './icons/Close'
import InfoIcon from './icons/Info'

const TONES = {
	info: 'border-app-border bg-app-card text-app-text',
	success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
	warning: 'border-amber-500/50 bg-amber-400/15 text-amber-900 dark:text-amber-200',
	danger: 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300',
}

/** Inline message. tone: info | success | warning | danger. Pass `onClose` to make it dismissible. */
const Alert = ({ tone = 'info', title, onClose, icon, className = '', children }) => (
	<div
		role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
		className={`flex items-start gap-3 border px-4 py-3 text-sm ${TONES[tone]} ${className}`}
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

export default Alert
