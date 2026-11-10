import type { IconProps } from '../../types'

const ChessIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="6" r="3" />
		<path d="M9 11h6" />
		<path d="M10 11c0 3-1 5-3 7M14 11c0 3 1 5 3 7" />
		<path d="M7 18h10v3H7z" />
	</svg>
)

export default ChessIcon
