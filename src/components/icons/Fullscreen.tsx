import type { IconProps } from '../../types'

const FullscreenIcon = ({ className }: IconProps) => (
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
		<path d="M8 3H3v5" />
		<path d="M16 3h5v5" />
		<path d="M21 16v5h-5" />
		<path d="M8 21H3v-5" />
	</svg>
)

export default FullscreenIcon
