import type { IconProps } from '../../types'

const ChevronsLeftIcon = ({ className }: IconProps) => (
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
		<path d="M18 17l-5-5 5-5" />
		<path d="M11 17l-5-5 5-5" />
	</svg>
)

export default ChevronsLeftIcon
