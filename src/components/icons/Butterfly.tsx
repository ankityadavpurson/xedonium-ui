import type { IconProps } from '../../types'

const ButterflyIcon = ({ className }: IconProps) => (
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
		<path d="M12 12C11 5 4 3 3 7c-1 3 3 5 9 5z" />
		<path d="M12 12c-5 0-8 2-7 6 1 3 6 2 7-2" />
		<path d="M12 12c1-7 8-9 9-5 1 3-3 5-9 5z" />
		<path d="M12 12c5 0 8 2 7 6-1 3-6 2-7-2" />
		<path d="M10 3l2 5 2-5" />
	</svg>
)

export default ButterflyIcon
