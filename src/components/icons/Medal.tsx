import type { IconProps } from '../../types'

const MedalIcon = ({ className }: IconProps) => (
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
		<path d="M8 2l4 7 4-7" />
		<circle cx="12" cy="15" r="6" />
		<path d="M12 12v6" />
	</svg>
)

export default MedalIcon
