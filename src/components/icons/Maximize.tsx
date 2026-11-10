import type { IconProps } from '../../types'

const MaximizeIcon = ({ className }: IconProps) => (
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
		<path d="M15 3h6v6" />
		<path d="M9 21H3v-6" />
		<path d="M21 3l-7 7" />
		<path d="M3 21l7-7" />
	</svg>
)

export default MaximizeIcon
