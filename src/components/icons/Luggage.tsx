import type { IconProps } from '../../types'

const LuggageIcon = ({ className }: IconProps) => (
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
		<path d="M6 8h12v13H6z" />
		<path d="M9 8V4h6v4" />
		<path d="M9 12v5M15 12v5" />
		<path d="M8 21v1M16 21v1" />
	</svg>
)

export default LuggageIcon
