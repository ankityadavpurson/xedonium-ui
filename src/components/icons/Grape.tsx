import type { IconProps } from '../../types'

const GrapeIcon = ({ className }: IconProps) => (
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
		<circle cx="8" cy="9" r="2" />
		<circle cx="12" cy="9" r="2" />
		<circle cx="16" cy="9" r="2" />
		<circle cx="10" cy="13" r="2" />
		<circle cx="14" cy="13" r="2" />
		<circle cx="12" cy="17" r="2" />
		<path d="M12 7V3" />
		<path d="M12 3c2 0 4 0 5 2" />
	</svg>
)

export default GrapeIcon
