import type { IconProps } from '../../types'

const MinimizeIcon = ({ className }: IconProps) => (
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
		<path d="M4 14h6v6" />
		<path d="M20 10h-6V4" />
		<path d="M14 10l7-7" />
		<path d="M3 21l7-7" />
	</svg>
)

export default MinimizeIcon
