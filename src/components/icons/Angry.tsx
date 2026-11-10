import type { IconProps } from '../../types'

const AngryIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="10" />
		<path d="M8 17a5 5 0 0 1 8 0" />
		<path d="M7.5 8L10 9.5M16.5 8L14 9.5" />
		<path d="M9 12h.01M15 12h.01" />
	</svg>
)

export default AngryIcon
