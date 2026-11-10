import type { IconProps } from '../../types'

const TreesIcon = ({ className }: IconProps) => (
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
		<path d="M6 6L2 12h2.5L1 17h10l-3.5-5H10z" />
		<path d="M17 2l-5 7h2.5L11 16h12l-3.5-7H22z" />
		<path d="M6 17v5M17 16v6" />
	</svg>
)

export default TreesIcon
