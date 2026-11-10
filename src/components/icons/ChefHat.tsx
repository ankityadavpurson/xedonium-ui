import type { IconProps } from '../../types'

const ChefHatIcon = ({ className }: IconProps) => (
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
		<path d="M6 17H5a3 3 0 0 1-1-5.8A4 4 0 0 1 9 5a4 4 0 0 1 6 0 4 4 0 0 1 5 6.2A3 3 0 0 1 19 17h-1" />
		<path d="M6 17v4h12v-4" />
		<path d="M6 17h12" />
	</svg>
)

export default ChefHatIcon
