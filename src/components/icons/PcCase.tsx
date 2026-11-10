import type { IconProps } from '../../types'

const PcCaseIcon = ({ className }: IconProps) => (
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
		<rect x="6" y="2" width="12" height="20" />
		<path d="M9 6h6M9 9h6" />
		<circle cx="12" cy="17" r="2" />
	</svg>
)

export default PcCaseIcon
