import type { IconProps } from '../../types'

const CalculatorIcon = ({ className }: IconProps) => (
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
		<rect x="5" y="2" width="14" height="20" />
		<rect x="8" y="5" width="8" height="4" />
		<path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
	</svg>
)

export default CalculatorIcon
