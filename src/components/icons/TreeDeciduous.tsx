import type { IconProps } from '../../types'

const TreeDeciduousIcon = ({ className }: IconProps) => (
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
		<path d="M7 15a5 5 0 0 1-1-9.5A5 5 0 0 1 12 2a5 5 0 0 1 6 3.5A5 5 0 0 1 17 15z" />
		<path d="M12 15v7M8 22h8" />
	</svg>
)

export default TreeDeciduousIcon
