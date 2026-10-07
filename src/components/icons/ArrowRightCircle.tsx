import type { IconProps } from '../../types'

const ArrowRightCircleIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M8 12h8" />
		<path d="M12 8l4 4-4 4" />
	</svg>
)

export default ArrowRightCircleIcon
