import type { IconProps } from '../../types'

const BusIcon = ({ className }: IconProps) => (
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
		<rect x="4" y="3" width="16" height="16" />
		<path d="M4 12h16" />
		<path d="M8 7h8" />
		<path d="M8 15.5h.01M16 15.5h.01" />
		<path d="M6 19v3M18 19v3" />
	</svg>
)

export default BusIcon
