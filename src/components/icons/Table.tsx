import type { IconProps } from '../../types'

const TableIcon = ({ className }: IconProps) => (
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
		<path d="M3 4h18v16H3z" />
		<path d="M3 10h18" />
		<path d="M10 4v16" />
	</svg>
)

export default TableIcon
