import type { IconProps } from '../../types'

const UnlockIcon = ({ className }: IconProps) => (
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
		<rect x="4" y="11" width="16" height="10" />
		<path d="M8 11V6h8v2" />
	</svg>
)

export default UnlockIcon
