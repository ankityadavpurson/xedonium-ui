import type { IconProps } from '../../types'

const FullscreenExitIcon = ({ className }: IconProps) => (
	<svg
		aria-hidden="true"
		focusable="false"
		className={className ?? 'w-4 h-4'}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="square"
		strokeLinejoin="miter"
		strokeMiterlimit={10}
	>
		<path d="M8 3v5H3" />
		<path d="M21 8h-5V3" />
		<path d="M16 21v-5h5" />
		<path d="M3 16h5v5" />
	</svg>
)

export default FullscreenExitIcon
