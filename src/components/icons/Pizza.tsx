import type { IconProps } from '../../types'

const PizzaIcon = ({ className }: IconProps) => (
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
		<path d="M3 6l9 16 9-16" />
		<path d="M3 6a20 20 0 0 1 18 0" />
		<circle cx="10" cy="10" r="1.5" />
		<circle cx="14" cy="12" r="1.5" />
		<circle cx="12" cy="16" r="1" />
	</svg>
)

export default PizzaIcon
