import type { IconProps } from '../../types'

const WindIcon = ({ className }: IconProps) => (
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
		<path d="M3 8h10a3 3 0 1 0-3-3" />
		<path d="M3 12h15a3 3 0 1 1-3 3" />
		<path d="M3 16h8a2.5 2.5 0 1 1-2.5 2.5" />
	</svg>
)

export default WindIcon
