import type { IconProps } from '../../types'

const ListOrderedIcon = ({ className }: IconProps) => (
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
		<path d="M10 6h11" />
		<path d="M10 12h11" />
		<path d="M10 18h11" />
		<path d="M4 6h1v4" />
		<path d="M4 10h2" />
		<path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
	</svg>
)

export default ListOrderedIcon
