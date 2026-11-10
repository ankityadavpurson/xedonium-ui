import type { IconProps } from '../../types'

const ScanFaceIcon = ({ className }: IconProps) => (
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
		<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" />
		<path d="M9 9h.01M15 9h.01" />
		<path d="M9 15a4 4 0 0 0 6 0" />
	</svg>
)

export default ScanFaceIcon
