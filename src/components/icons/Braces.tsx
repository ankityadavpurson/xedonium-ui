import type { IconProps } from '../../types'

const BracesIcon = ({ className }: IconProps) => (
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
		<path d="M8 3H6v7l-3 2 3 2v7h2" />
		<path d="M16 3h2v7l3 2-3 2v7h-2" />
	</svg>
)

export default BracesIcon
