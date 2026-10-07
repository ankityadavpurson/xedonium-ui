import type { IconProps } from '../../types'

const ClipboardCheckIcon = ({ className }: IconProps) => (
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
		<rect x="8" y="2" width="8" height="4" />
		<path d="M16 4h4v18H4V4h4" />
		<path d="M9 14l2 2 4-4" />
	</svg>
)

export default ClipboardCheckIcon
