import type { IconProps } from '../../types'

const ScrollTextIcon = ({ className }: IconProps) => (
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
		<path d="M7 3h13v14M7 3v14" />
		<path d="M3 17h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<path d="M11 8h6M11 12h6" />
	</svg>
)

export default ScrollTextIcon
