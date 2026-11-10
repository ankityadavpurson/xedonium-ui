import type { IconProps } from '../../types'

const BeefIcon = ({ className }: IconProps) => (
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
		<path d="M16.4 13.7A6.5 6.5 0 1 0 6.3 6.6c-1.1 3.1-.8 3.9-3.2 6.1A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3" />
		<circle cx="13" cy="9" r="2" />
		<path d="M7 12.5c1.5.5 3 .5 4.5-.5" />
	</svg>
)

export default BeefIcon
