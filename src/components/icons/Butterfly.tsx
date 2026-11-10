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
		<path d="M12 8v12" />
		<path d="M12 8L10 3M12 8l2-5" />
		<path d="M12 11C10 6 3 4 3 8c0 3 3 5 9 4" />
		<path d="M12 11c2-5 9-7 9-3 0 3-3 5-9 4" />
		<path d="M12 13c-4 0-7 2-6 5 1 3 5 2 6-2" />
		<path d="M12 13c4 0 7 2 6 5-1 3-5 2-6-2" />
	</svg>
)

export default ButterflyIcon
