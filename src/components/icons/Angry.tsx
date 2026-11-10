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
		<path d="M16 17s-1.5-2-4-2-4 2-4 2" />
		<path d="M6.5 7.5l4 2.5M17.5 7.5l-4 2.5" />
	</svg>
)

export default AngryIcon
