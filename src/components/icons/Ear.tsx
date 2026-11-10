import type { IconProps } from '../../types'

const EarIcon = ({ className }: IconProps) => (
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
		<path d="M7 9a5 5 0 0 1 10 0c0 4-4 5-4 9a3 3 0 0 1-6 0" />
		<path d="M10 9a2 2 0 0 1 4 0c0 2-2 3-2 5" />
	</svg>
)

export default EarIcon
