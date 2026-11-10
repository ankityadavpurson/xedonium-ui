import type { IconProps } from '../../types'

const TrainIcon = ({ className }: IconProps) => (
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
		<path d="M2 6h10c5 0 10 5 10 9v2H2z" />
		<path d="M15 9.5c2 1 3.5 2.5 4.5 4.5H15z" />
		<path d="M5 10h2M10 10h2" />
		<path d="M2 21h20" />
	</svg>
)

export default TrainIcon
