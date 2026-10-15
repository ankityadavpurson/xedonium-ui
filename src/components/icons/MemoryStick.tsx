import type { IconProps } from '../../types'

const MemoryStickIcon = ({ className }: IconProps) => (
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
		<rect x="2" y="6" width="20" height="11" />
		<rect x="5" y="9" width="4" height="5" />
		<rect x="15" y="9" width="4" height="5" />
		<path d="M6 17v3M10 17v3M14 17v3M18 17v3" />
	</svg>
)

export default MemoryStickIcon
