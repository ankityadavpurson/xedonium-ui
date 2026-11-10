import type { IconProps } from '../../types'

const FrownIcon = ({ className }: IconProps) => (
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
		<path d="M16 16s-1.5-2-4-2-4 2-4 2" />
		<path d="M9 9h.01M15 9h.01" />
	</svg>
)

export default FrownIcon
