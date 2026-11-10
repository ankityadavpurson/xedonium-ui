import type { IconProps } from '../../types'

const LampIcon = ({ className }: IconProps) => (
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
		<path d="M8 3h8l3 9H5z" />
		<path d="M12 12v8" />
		<path d="M8 21h8" />
	</svg>
)

export default LampIcon
