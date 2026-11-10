import type { IconProps } from '../../types'

const LocateFixedIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="3" />
		<circle cx="12" cy="12" r="7" />
		<path d="M2 12h3M19 12h3M12 2v3M12 19v3" />
	</svg>
)

export default LocateFixedIcon
