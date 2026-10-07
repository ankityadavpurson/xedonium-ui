import type { IconProps } from '../../types'

const ShapesIcon = ({ className }: IconProps) => (
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
		<path d="M8 3l5 9H3z" />
		<rect x="14" y="14" width="7" height="7" />
		<circle cx="7.5" cy="17.5" r="3.5" />
	</svg>
)

export default ShapesIcon
