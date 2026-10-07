import type { IconProps } from '../../types'

const PrinterIcon = ({ className }: IconProps) => (
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
		<path d="M6 9V3h12v6" />
		<path d="M6 18H3V9h18v9h-3" />
		<rect x="6" y="14" width="12" height="7" />
	</svg>
)

export default PrinterIcon
