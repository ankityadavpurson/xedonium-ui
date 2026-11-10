import type { IconProps } from '../../types'

const DoorOpenIcon = ({ className }: IconProps) => (
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
		<path d="M13 4h3a2 2 0 0 1 2 2v14" />
		<path d="M2 20h3M13 20h9" />
		<path d="M10 12v.01" />
		<path d="M13 4.6v16.1a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.5-1.9l4-1A2 2 0 0 1 13 4.6z" />
	</svg>
)

export default DoorOpenIcon
