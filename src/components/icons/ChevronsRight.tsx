import type { IconProps } from '../../types'

const ChevronsRightIcon = ({ className }: IconProps) => (
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
		<path d="M6 17l5-5-5-5" />
		<path d="M13 17l5-5-5-5" />
	</svg>
)

export default ChevronsRightIcon
