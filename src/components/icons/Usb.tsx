import type { IconProps } from '../../types'

const UsbIcon = ({ className }: IconProps) => (
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
		<circle cx="10" cy="7" r="1" />
		<circle cx="4" cy="20" r="1" />
		<path d="M4.7 19.3L19 5" />
		<path d="M21 3l-3 1 2 2z" />
		<path d="M9.26 7.68L5 12l2 5" />
		<path d="M10 14l5 2 3.5-3.5" />
		<path d="M18 12l1-1 1 1-1 1z" />
	</svg>
)

export default UsbIcon
