import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import type { Size } from '../types'
import StarIcon from './icons/Star'

export type RatingColor = 'default' | 'warning' | 'danger' | 'success' | 'info'

export interface RatingProps {
	/** Current rating, 0 to `max` (controlled). */
	value?: number
	/** Initial rating when uncontrolled. */
	defaultValue?: number
	/** Receives the new rating; clicking the current one again clears it to 0. */
	onChange?: (value: number) => void
	/** Number of icons (default 5). */
	max?: number
	/** `1` for whole icons, `0.5` to allow halves. */
	precision?: 1 | 0.5
	/** Show the rating without letting it change. */
	readOnly?: boolean
	disabled?: boolean
	size?: Size
	/** Accessible name, e.g. "Product rating". */
	label?: string
	/** Icon used for every position (default a star; it is filled when active). */
	icon?: ReactNode
	/** Color of the filled icons: a theme color, or any CSS color such as `#e11d48` or `royalblue`. */
	color?: RatingColor | (string & {})
	className?: string
}

const SIZES: Record<Size, string> = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }

const COLORS: Record<RatingColor, string> = {
	default: 'text-app-strong',
	warning: 'text-amber-400',
	danger: 'text-red-500',
	success: 'text-emerald-500',
	info: 'text-sky-500',
}

/**
 * Star rating. `value` runs from 0 to `max` (5 by default); `precision={0.5}` allows half stars. It is a slider for
 * keyboards and screen readers (Left / Right or Up / Down change it by one step, Home clears it, End gives the
 * maximum) and hovering previews the rating you would pick. `readOnly` shows a rating (a review score) without
 * letting it change.
 */
const Rating = ({
	value,
	defaultValue = 0,
	onChange,
	max = 5,
	precision = 1,
	readOnly = false,
	disabled = false,
	size = 'md',
	label = 'Rating',
	icon,
	color = 'default',
	className = '',
}: RatingProps) => {
	const [inner, setInner] = useState(defaultValue)
	const [hover, setHover] = useState<number | null>(null)
	const current = value ?? inner
	const shown = hover ?? current
	const interactive = !readOnly && !disabled
	const glyph = SIZES[size]
	const named = color in COLORS
	const fillClass = named ? COLORS[color as RatingColor] : ''

	const set = (next: number) => {
		const clamped = Math.min(Math.max(next, 0), max)
		if (value === undefined) setInner(clamped)
		onChange?.(clamped)
	}

	// Value under the pointer: the icon's index, plus the half it is over when halves are allowed
	const valueAt = (index: number, event: MouseEvent<HTMLElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		const fraction = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 1
		return precision === 0.5 && fraction <= 0.5 ? index + 0.5 : index + 1
	}

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!interactive) return
		const keys: Record<string, number> = {
			ArrowRight: current + precision,
			ArrowUp: current + precision,
			ArrowLeft: current - precision,
			ArrowDown: current - precision,
			Home: 0,
			End: max,
		}
		if (!(event.key in keys)) return
		event.preventDefault()
		set(keys[event.key])
	}

	const icons = Array.from({ length: max }, (_, index) => {
		const fill = Math.min(Math.max(shown - index, 0), 1)
		return (
			<span
				key={index}
				data-testid="rating-icon"
				onMouseMove={interactive ? event => setHover(valueAt(index, event)) : undefined}
				onClick={
					interactive
						? event => {
								const next = valueAt(index, event)
								set(next === current ? 0 : next)
							}
						: undefined
				}
				className={`relative inline-flex shrink-0 text-app-border ${interactive ? 'cursor-pointer' : ''}`}
			>
				{icon ?? <StarIcon className={glyph} />}
				<span
					aria-hidden="true"
					style={{ width: `${fill * 100}%`, ...(named ? {} : { color }) }}
					className={`pointer-events-none absolute inset-y-0 left-0 overflow-hidden ${fillClass}`}
				>
					{icon ?? <StarIcon className={`${glyph} max-w-none fill-current`} />}
				</span>
			</span>
		)
	})

	return (
		<div
			role={readOnly ? 'img' : 'slider'}
			aria-label={readOnly ? `${label}: ${current} out of ${max}` : label}
			aria-valuemin={readOnly ? undefined : 0}
			aria-valuemax={readOnly ? undefined : max}
			aria-valuenow={readOnly ? undefined : current}
			aria-valuetext={readOnly ? undefined : `${current} out of ${max}`}
			aria-disabled={disabled || undefined}
			tabIndex={interactive ? 0 : undefined}
			onKeyDown={handleKeyDown}
			onMouseLeave={() => setHover(null)}
			className={`inline-flex gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-app-strong ${
				disabled ? 'cursor-not-allowed opacity-50' : ''
			} ${className}`}
		>
			{icons}
		</div>
	)
}

export default Rating
