import CheckIcon from './icons/Check'
import CloseIcon from './icons/Close'
import InfoIcon from './icons/Info'

// `error` is an alias of `danger`, kept for older callers
const TONES = {
	success: 'bg-emerald-700 text-white',
	danger: 'bg-red-700 text-white',
	warning: 'bg-amber-400 text-black',
	info: 'bg-sky-700 text-white',
}

// Where the stack sits; top positions put the newest toast nearest the edge, like the bottom ones do
const POSITIONS = {
	'top-left': 'top-5 left-5 items-start flex-col-reverse',
	'top-center': 'top-5 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
	'top-right': 'top-5 right-5 items-end flex-col-reverse',
	'middle-left': 'top-1/2 left-5 -translate-y-1/2 items-start flex-col',
	'middle-center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center flex-col',
	'middle-right': 'top-1/2 right-5 -translate-y-1/2 items-end flex-col',
	'bottom-left': 'bottom-5 left-5 items-start flex-col',
	'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center flex-col',
	'bottom-right': 'bottom-5 right-5 items-end flex-col',
}

const toneOf = type => (type === 'error' ? 'danger' : TONES[type] ? type : 'success')

/**
 * Always rendered so the live region exists before a message arrives; screen readers only announce additions.
 * Pass `toasts` (the array from `useTimedToast`) to stack several, or `toast` for a single one.
 * toast: { id?, msg, type?, link?, actions?, icon? }. type: success (default) | danger (or error) | warning | info.
 * actions: [{ label, onClick }] render as buttons (the toast is dismissed after one is used, when `onClose` is
 * given). `position`: top | middle | bottom + left | center | right, e.g. "top-center" (default "bottom-right").
 * `onClose(id)` also adds a dismiss button to each toast; pass `hideToast`.
 */
const Toast = ({ toast, toasts, onClose, position = 'bottom-right' }) => {
	const items = toasts ?? (toast ? [toast] : [])

	return (
		<div
			role="status"
			aria-live="polite"
			aria-atomic="false"
			aria-relevant="additions"
			className={`fixed z-[var(--xd-z-toast,90)] flex max-w-[calc(100vw-2.5rem)] gap-2 ${POSITIONS[position] ?? POSITIONS['bottom-right']}`}
		>
			{items.map((item, index) => {
				const tone = toneOf(item.type)
				const icon =
					item.icon ?? (tone === 'success' ? <CheckIcon className="h-4 w-4" /> : <InfoIcon className="h-4 w-4" />)
				return (
					<div
						key={item.id ?? index}
						className={`flex max-w-sm items-start gap-3 px-4 py-3 text-sm shadow-xl ${TONES[tone]}`}
					>
						<span className="mt-0.5 shrink-0">{icon}</span>
						<div className="min-w-0 flex-1">
							<div className="font-semibold">
								{item.msg}
								{item.link && (
									<>
										{' '}
										<a href={item.link.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
											{item.link.label}
										</a>
									</>
								)}
							</div>
							{item.actions?.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-2">
									{item.actions.map(action => (
										<button
											key={action.label}
											type="button"
											onClick={() => {
												action.onClick?.()
												onClose?.(item.id)
											}}
											className="border border-current px-2 py-1 text-xs font-semibold uppercase tracking-widest transition hover:bg-black/15"
										>
											{action.label}
										</button>
									))}
								</div>
							)}
						</div>
						{onClose && (
							<button
								type="button"
								onClick={() => onClose(item.id)}
								aria-label="Dismiss"
								className="-m-2 shrink-0 p-2 opacity-70 transition hover:opacity-100"
							>
								<CloseIcon className="h-4 w-4" />
							</button>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default Toast
