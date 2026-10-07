import type { IconProps } from '../../types'

const ServerIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="2" width="20" height="8" />
		<rect x="2" y="14" width="20" height="8" />
		<path d="M6 6h.01M6 18h.01" />
	</svg>
)

export default ServerIcon
