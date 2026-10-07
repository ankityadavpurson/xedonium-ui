import type { IconProps } from '../../types'

const DevicesIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="4" width="12" height="10" />
		<path d="M6 18h4M8 14v4" />
		<rect x="17" y="8" width="5" height="12" />
	</svg>
)

export default DevicesIcon
