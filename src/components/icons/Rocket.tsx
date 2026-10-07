import type { IconProps } from '../../types'

const RocketIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'h-4 w-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 2c4 2 6 6 6 10l-3 4H9l-3-4c0-4 2-8 6-10z" />
		<circle cx="12" cy="9" r="2" />
		<path d="M6 12l-3 4 4 1M18 12l3 4-4 1" />
		<path d="M10 19l2 3 2-3" />
	</svg>
)

export default RocketIcon
