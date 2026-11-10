import type { IconProps } from '../../types'

const TrainFrontIcon = ({ className }: IconProps) => (
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
		<path d="M7 2h10l2 4v12H5V6z" />
		<path d="M5 11h14" />
		<path d="M8 15h.01M16 15h.01" />
		<path d="M8 18l-2 3M16 18l2 3" />
		<path d="M9 5h6" />
	</svg>
)

export default TrainFrontIcon
