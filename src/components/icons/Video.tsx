import type { IconProps } from '../../types'

const VideoIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="6" width="14" height="12" />
		<path d="M16 10l6-3v10l-6-3" />
	</svg>
)

export default VideoIcon
