import type { IconProps } from '../../types'

const CloudLightningIcon = ({ className }: IconProps) => (
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
		<path d="M18 10h-1.3A8 8 0 1 0 9 17h2" />
		<path d="M18 10a5 5 0 0 1 0 7" />
		<path d="M13 11l-3 5h4l-3 6" />
	</svg>
)

export default CloudLightningIcon
