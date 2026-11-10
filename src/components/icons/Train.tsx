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
		<path d="M2 5h16l4 6v6H2z" />
		<path d="M5 8h3v3H5zM10 8h3v3h-3z" />
		<circle cx="7" cy="19" r="2" />
		<circle cx="17" cy="19" r="2" />
		<path d="M2 22h20" />
	</svg>
)

export default TrainIcon
