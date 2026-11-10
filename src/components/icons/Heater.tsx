import type { IconProps } from '../../types'

const HeaterIcon = ({ className }: IconProps) => (
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
		<path d="M3 6h18v12H3z" />
		<path d="M8 6v12M12 6v12M16 6v12" />
		<path d="M6 18v3M18 18v3" />
	</svg>
)

export default HeaterIcon
