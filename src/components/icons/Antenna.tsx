import type { IconProps } from '../../types'

const AntennaIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="8" r="1.5" />
		<path d="M12 9.5L7 22M12 9.5L17 22M9.5 17h5" />
		<path d="M8 5a5.7 5.7 0 0 0 0 6M16 5a5.7 5.7 0 0 1 0 6" />
		<path d="M5 3a9 9 0 0 0 0 10M19 3a9 9 0 0 1 0 10" />
	</svg>
)

export default AntennaIcon
