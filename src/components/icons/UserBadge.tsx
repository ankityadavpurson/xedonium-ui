import type { IconProps } from '../../types'

const UserBadgeIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="3" width="18" height="18" />
		<circle cx="12" cy="10" r="3" />
		<path d="M7 19v-1l2-2h6l2 2v1" />
	</svg>
)

export default UserBadgeIcon
