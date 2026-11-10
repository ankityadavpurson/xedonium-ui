import type { IconProps } from '../../types'

const LockIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="11" width="18" height="11" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
)

export default LockIcon
