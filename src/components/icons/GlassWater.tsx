import type { IconProps } from '../../types'

const GlassWaterIcon = ({ className }: IconProps) => (
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
		<path d="M6 3h12l-1.5 18h-9z" />
		<path d="M7 11c2 1.5 3 1.5 5 0s3-1.5 5 0" />
	</svg>
)

export default GlassWaterIcon
