import type { IconProps } from '../../types'

const SaveIcon = ({ className }: IconProps) => (
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
		<path d="M3 3h14l4 4v14H3z" />
		<path d="M7 3v6h9V3M7 21v-8h10v8" />
	</svg>
)

export default SaveIcon
