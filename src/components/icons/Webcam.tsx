import type { IconProps } from '../../types'

const WebcamIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="10" r="8" />
		<circle cx="12" cy="10" r="3" />
		<path d="M7 22h10M12 22v-4" />
	</svg>
)

export default WebcamIcon
