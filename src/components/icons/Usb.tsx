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
		<circle cx="12" cy="20" r="2" />
		<path d="M12 18V6" />
		<path d="M9.5 7L12 2l2.5 5z" />
		<path d="M12 14l-4.5-2.5V9" />
		<circle cx="7.5" cy="7.5" r="1.5" />
		<path d="M12 11l4.5-2V8" />
		<rect x="15" y="5" width="3" height="3" />
	</svg>
)

export default UsbIcon
