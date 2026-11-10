import type { IconProps } from '../../types'

const ChairIcon = ({ className }: IconProps) => (
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
		<path d="M8 3h8v9H8z" />
		<path d="M6 12h12v3H6z" />
		<path d="M7 15v6M17 15v6" />
	</svg>
)

export default ChairIcon
