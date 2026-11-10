import type { IconProps } from '../../types'

const BirdIcon = ({ className }: IconProps) => (
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
		<path d="M16 7h.01" />
		<path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.3-2.3L2 20" />
		<path d="M20 7l2 .5-2 .5" />
		<path d="M10 18v3M14 17.8V21" />
		<path d="M7 18a6 6 0 0 0 3.8-10.6" />
	</svg>
)

export default BirdIcon
