import type { IconProps } from '../../types'

const RabbitIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="16" r="6" />
		<path d="M9 11C7 8 7 3 9 3s2.5 5 2 8M15 11c2-3 2-8 0-8s-2.5 5-2 8" />
		<path d="M10 15h.01M14 15h.01" />
		<path d="M11 18h2" />
	</svg>
)

export default RabbitIcon
