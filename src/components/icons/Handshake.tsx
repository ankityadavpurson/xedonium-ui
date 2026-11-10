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
		<path d="M11 17l2 2a1 1 0 1 0 3-3" />
		<path d="M14 14l2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
		<path d="M21 3l1 11h-2" />
		<path d="M3 3L2 14l6.5 6.5a1 1 0 1 0 3-3" />
		<path d="M3 4h8" />
	</svg>
)

export default HandshakeIcon
