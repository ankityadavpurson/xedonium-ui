import type { IconProps } from '../../types'

const BellDotIcon = ({ className }: IconProps) => (
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
		<path d="M4 19h16l-2-3v-4M6 16V9a6 6 0 0 1 8-5.6" />
		<path d="M10 22h4" />
		<circle cx="18" cy="5" r="3" />
	</svg>
)

export default BellDotIcon
