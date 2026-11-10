import type { IconProps } from '../../types'

const UserRoundIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="8" r="4" />
		<path d="M4 21a8 8 0 0 1 16 0" />
	</svg>
)

export default UserRoundIcon
