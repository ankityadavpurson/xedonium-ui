import type { IconProps } from '../../types'

const DropletsIcon = ({ className }: IconProps) => (
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
		<path d="M7 3L3.54 9a4 4 0 1 0 6.92 0z" />
		<path d="M16 4l-4.45 8.73a5 5 0 1 0 8.9 0z" />
	</svg>
)

export default DropletsIcon
