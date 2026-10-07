import type { IconProps } from '../../types'

const PieChartIcon = ({ className }: IconProps) => (
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
		<path d="M21.2 15.9A10 10 0 1 1 8 2.8" />
		<path d="M22 12A10 10 0 0 0 12 2v10z" />
	</svg>
)

export default PieChartIcon
