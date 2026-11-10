import type { IconProps } from '../../types'

const GlassesIcon = ({ className }: IconProps) => (
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
		<circle cx="6" cy="15" r="4" />
		<circle cx="18" cy="15" r="4" />
		<path d="M10 15a2 2 0 0 1 4 0" />
		<path d="M2.5 13L5 7M21.5 13L19 7" />
	</svg>
)

export default GlassesIcon
