import type { IconProps } from '../../types'

const MicrowaveIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="5" width="20" height="14" />
		<rect x="5" y="8" width="9" height="8" />
		<path d="M17 5v14" />
		<path d="M19.5 9h.01M19.5 12h.01M19.5 15h.01" />
	</svg>
)

export default MicrowaveIcon
