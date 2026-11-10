import type { IconProps } from '../../types'

const RadioIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="8" width="18" height="13" />
		<path d="M7 8L19 3" />
		<circle cx="15" cy="14.5" r="3" />
		<path d="M6 13h3M6 16h3" />
	</svg>
)

export default RadioIcon
