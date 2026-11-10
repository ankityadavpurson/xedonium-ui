import type { IconProps } from '../../types'

const LaptopMinimalIcon = ({ className }: IconProps) => (
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
		<path d="M5 5h14v11H5z" />
		<path d="M2 16h20l-1.5 4h-17z" />
	</svg>
)

export default LaptopMinimalIcon
