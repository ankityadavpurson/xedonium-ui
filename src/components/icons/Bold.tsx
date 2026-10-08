import type { IconProps } from '../../types'

const BoldIcon = ({ className }: IconProps) => (
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
		<path d="M6 4h8a4 4 0 0 1 0 8H6z" />
		<path d="M6 12h9a4 4 0 0 1 0 8H6z" />
	</svg>
)

export default BoldIcon
