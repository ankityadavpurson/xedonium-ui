import type { IconProps } from '../../types'

const PiIcon = ({ className }: IconProps) => (
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
		<path d="M9 4v16" />
		<path d="M4 7c0-1.7 1.3-3 3-3h13" />
		<path d="M18 20c-1.7 0-3-1.3-3-3V4" />
	</svg>
)

export default PiIcon
