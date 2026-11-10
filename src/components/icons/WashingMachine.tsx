import type { IconProps } from '../../types'

const WashingMachineIcon = ({ className }: IconProps) => (
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
		<rect x="4" y="2" width="16" height="20" />
		<path d="M4 7h16" />
		<circle cx="12" cy="14.5" r="4.5" />
		<path d="M7 4.5h1M10.5 4.5h1M15 4.5h2" />
	</svg>
)

export default WashingMachineIcon
