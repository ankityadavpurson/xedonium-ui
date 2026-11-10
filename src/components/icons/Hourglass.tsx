import type { IconProps } from '../../types'

const HourglassIcon = ({ className }: IconProps) => (
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
		<path d="M6 2h12M6 22h12" />
		<path d="M7 2v4l5 6-5 6v4M17 2v4l-5 6 5 6v4" />
	</svg>
)

export default HourglassIcon
