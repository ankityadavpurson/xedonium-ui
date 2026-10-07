import type { IconProps } from '../../types'

const LogInIcon = ({ className }: IconProps) => (
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
		<path d="M15 3h6v18h-6M10 17l5-5-5-5M15 12H3" />
	</svg>
)

export default LogInIcon
