import type { IconProps } from '../../types'

const TagsIcon = ({ className }: IconProps) => (
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
		<path d="M6 2h7.17L21 9.83 14.83 16 6 7.17z" />
		<path d="M2 7v6.17l8 8" />
		<path d="M10 6h.01" />
	</svg>
)

export default TagsIcon
