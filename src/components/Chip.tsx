import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Tone } from '../types'

type ChipSize = 'sm' | 'md'
type ChipTone = 'default' | Tone

export interface ChipProps extends Omit<ComponentPropsWithoutRef<'span'>, 'onClick'> {
	/** Pressed state when `onClick` makes it a toggle. */
	selected?: boolean
	/** Makes the chip a toggle button. */
	onClick?: () => void
	/** Adds a remove (x) button. */
	onRemove?: () => void
	/** Accessible name of the remove button. */
	removeLabel?: string
	/** An icon or avatar before the text. */
	leading?: ReactNode
	size?: ChipSize
	/** Colour: `default` | `success` | `warning` | `danger` | `info`. Use it for status pills. */
	tone?: ChipTone
	/** Solid fill instead of the tinted outline (needs a `tone` other than `default`). */
	filled?: boolean
	disabled?: boolean
}

const sizeClasses: Record<ChipSize, string> = {
	sm: 'text-[11px]',
	md: 'text-xs',
}

const toneClasses: Record<ChipTone, { outline: string; filled: string }> = {
	default: {
		outline: 'border-app-border bg-app-card text-app-text',
		filled: 'border-app-strong bg-app-strong text-app-bg',
	},
	success: {
		outline: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
		filled: 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-black',
	},
	warning: {
		outline: 'border-amber-500/50 bg-amber-400/15 text-amber-900 dark:text-amber-200',
		filled: 'border-amber-400 bg-amber-400 text-black',
	},
	danger: {
		outline: 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-300',
		filled: 'border-red-600 bg-red-600 text-white dark:border-red-500 dark:bg-red-500',
	},
	info: {
		outline: 'border-sky-500/40 bg-sky-500/10 text-sky-800 dark:text-sky-300',
		filled: 'border-sky-600 bg-sky-600 text-white dark:border-sky-500 dark:bg-sky-500 dark:text-black',
	},
}

const padding: Record<ChipSize, string> = {
	sm: 'px-1.5 py-0.5',
	md: 'px-2.5 py-1',
}

/**
 * Compact tag for filters, selections and input values. Pass `onClick` to make it a toggle button (use `selected`
 * for its pressed state), and `onRemove` to add a remove (x) button. `leading` shows an icon or avatar before the text.
 * `tone` colours it (default | success | warning | danger | info) and `filled` makes that colour solid, so a Chip also
 * works as a status pill. A `selected` toggle always uses the strong fill.
 */
const Chip = ({
	selected,
	onClick,
	onRemove,
	removeLabel,
	leading,
	size = 'md',
	tone = 'default',
	filled = false,
	disabled = false,
	className = '',
	children,
	...rest
}: ChipProps) => {
	const label = removeLabel ?? (typeof children === 'string' ? `Remove ${children}` : 'Remove')
	const interactive = !!onClick
	const body = (
		<>
			{leading && <span className="inline-flex shrink-0 items-center">{leading}</span>}
			<span className="min-w-0 truncate">{children}</span>
		</>
	)

	return (
		<span
			className={`inline-flex max-w-full items-center border font-semibold transition ${sizeClasses[size]} ${
				selected ? toneClasses.default.filled : toneClasses[tone][filled ? 'filled' : 'outline']
			} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
		>
			{interactive ? (
				<button
					type="button"
					disabled={disabled}
					aria-pressed={selected === undefined ? undefined : !!selected}
					onClick={onClick}
					className={`inline-flex min-w-0 items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-app-strong ${padding[size]} ${
						disabled ? 'cursor-not-allowed' : selected || tone !== 'default' ? '' : 'hover:bg-app-bg'
					}`}
					{...rest}
				>
					{body}
				</button>
			) : (
				<span className={`inline-flex min-w-0 items-center gap-1.5 ${padding[size]}`} {...rest}>
					{body}
				</span>
			)}
			{onRemove && (
				<button
					type="button"
					disabled={disabled}
					aria-label={label}
					onClick={onRemove}
					className="inline-flex items-center self-stretch pr-2 text-current opacity-70 outline-none transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-app-strong disabled:cursor-not-allowed"
				>
					<svg
						aria-hidden="true"
						focusable="false"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						className="h-3 w-3"
					>
						<path strokeLinecap="square" strokeLinejoin="miter" d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			)}
		</span>
	)
}

export default Chip
