import type { IconProps } from '../../types'

const HardDriveIcon = ({ className }: IconProps) => (
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
		<path d="M22 12H2" />
		<path d="M5.5 4h13L22 12v8H2v-8z" />
		<path d="M6 16h.01M10 16h.01" />
	</svg>
)

export default HardDriveIcon
