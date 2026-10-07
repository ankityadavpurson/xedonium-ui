import type { IconProps } from '../../types'

const KeyIcon = ({ className }: IconProps) => (
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
		<circle cx="7.5" cy="15.5" r="4.5" />
		<path d="M10.7 12.3L21 2M16 7l3 3M19 4l2 2" />
	</svg>
)

export default KeyIcon
