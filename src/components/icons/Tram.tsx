import type { IconProps } from '../../types'

const TramIcon = ({ className }: IconProps) => (
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
		<rect x="4" y="6" width="16" height="13" />
		<path d="M8 6l4-4 4 4" />
		<path d="M4 12h16" />
		<path d="M8 15.5h.01M16 15.5h.01" />
		<path d="M8 19l-2 3M16 19l2 3" />
	</svg>
)

export default TramIcon
