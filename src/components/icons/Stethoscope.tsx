import type { IconProps } from '../../types'

const StethoscopeIcon = ({ className }: IconProps) => (
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
		<path d="M6 3H4v6a5 5 0 0 0 10 0V3h-2" />
		<path d="M9 14v2a5 5 0 0 0 10 0v-1" />
		<circle cx="19" cy="13" r="2" />
	</svg>
)

export default StethoscopeIcon
