import type { IconProps } from '../../types'

const ChartLineIcon = ({ className }: IconProps) => (
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
		<path d="M3 3v18h18" />
		<path d="M7 15l4-5 3 3 6-7" />
	</svg>
)

export default ChartLineIcon
