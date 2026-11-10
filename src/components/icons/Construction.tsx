import type { IconProps } from '../../types'

const ConstructionIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="5" width="20" height="8" />
		<path d="M7 5l-3 8M13 5l-3 8M19 5l-3 8" />
		<path d="M5 13v8M19 13v8" />
	</svg>
)

export default ConstructionIcon
