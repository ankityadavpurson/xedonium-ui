import type { IconProps } from '../../types'

const SquareCheckIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="3" width="18" height="18" />
		<path d="M8 12l3 3 5-6" />
	</svg>
)

export default SquareCheckIcon
