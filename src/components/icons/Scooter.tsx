import type { IconProps } from '../../types'

const ScooterIcon = ({ className }: IconProps) => (
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
		<circle cx="5" cy="19" r="2" />
		<circle cx="19" cy="19" r="2" />
		<path d="M7 19h10" />
		<path d="M19 17L16 4" />
		<path d="M13 4h6" />
	</svg>
)

export default ScooterIcon
