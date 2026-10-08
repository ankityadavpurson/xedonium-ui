import type { IconProps } from '../../types'

const UnderlineIcon = ({ className }: IconProps) => (
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
		<path d="M6 4v6a6 6 0 0 0 12 0V4" />
		<path d="M4 20h16" />
	</svg>
)

export default UnderlineIcon
