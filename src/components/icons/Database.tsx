import type { IconProps } from '../../types'

const DatabaseIcon = ({ className }: IconProps) => (
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
		<ellipse cx="12" cy="5" rx="9" ry="3" />
		<path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
		<path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
	</svg>
)

export default DatabaseIcon
