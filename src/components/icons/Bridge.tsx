import type { IconProps } from '../../types'

const BridgeIcon = ({ className }: IconProps) => (
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
		<path d="M2 15h20" />
		<path d="M7 4v17M17 4v17" />
		<path d="M2 12L7 5M17 5l5 7" />
		<path d="M7 5q5 8 10 0" />
		<path d="M12 9v6" />
	</svg>
)

export default BridgeIcon
