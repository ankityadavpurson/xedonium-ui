import type { IconProps } from '../../types'

const KeyRoundIcon = ({ className }: IconProps) => (
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
		<circle cx="15.5" cy="8.5" r="5.5" />
		<path d="M11.6 12.4L3 21M6 18l3 3" />
	</svg>
)

export default KeyRoundIcon
