import type { IconProps } from '../../types'

const ForkliftIcon = ({ className }: IconProps) => (
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
		<path d="M4 16V6h6l3 5v5H4z" />
		<circle cx="6" cy="19" r="2" />
		<circle cx="12" cy="19" r="2" />
		<path d="M17 3v17" />
		<path d="M17 18h5M17 14h5" />
	</svg>
)

export default ForkliftIcon
