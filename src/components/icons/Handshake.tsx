import type { IconProps } from '../../types'

const HandshakeIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="8" width="3" height="8" />
		<rect x="19" y="8" width="3" height="8" />
		<path d="M5 9.5l4.5-2.5h3L16 9l3 .5" />
		<path d="M5 14l5 4 3-1 3-2-4-4-3 2" />
	</svg>
)

export default HandshakeIcon
