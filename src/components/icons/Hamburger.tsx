import type { IconProps } from '../../types'

const HamburgerIcon = ({ className }: IconProps) => (
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
		<path d="M4 10a8 6 0 0 1 16 0z" />
		<path d="M4 13l2 2 3-2 3 2 3-2 3 2 2-2" />
		<path d="M4 17h16v4H4z" />
		<path d="M9 6h.01M14 7h.01" />
	</svg>
)

export default HamburgerIcon
