import type { IconProps } from '../../types'

/**
 * Sort indicator: stacked up / down chevrons. `direction` ('asc' | 'desc') highlights one chevron; without it both
 * are dimmed (unsorted).
 */
const SortIcon = ({ direction, className }: IconProps & { direction?: 'asc' | 'desc' | null }) => {
	const dim = 'opacity-35'
	return (
		<svg
			aria-hidden="true"
			focusable="false"
			className={className ?? 'w-3.5 h-3.5 flex-shrink-0'}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="square"
			strokeLinejoin="miter"
		>
			<path className={direction === 'desc' ? dim : direction ? '' : dim} d="M7 10l5-5 5 5" />
			<path className={direction === 'asc' ? dim : direction ? '' : dim} d="M7 14l5 5 5-5" />
		</svg>
	)
}

export default SortIcon
