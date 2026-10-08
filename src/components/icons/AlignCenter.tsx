import type { IconProps } from '../../types'

const AlignCenterIcon = ({ className }: IconProps) => (
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
		<path d="M3 6h18" />
		<path d="M7 12h10" />
		<path d="M5 18h14" />
	</svg>
)

export default AlignCenterIcon
