import type { IconProps } from '../../types'

const BathIcon = ({ className }: IconProps) => (
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
		<path d="M2 12h20" />
		<path d="M4 12v3a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-3" />
		<path d="M7 20l-1 2M17 20l1 2" />
		<path d="M6 12V5a2 2 0 0 1 2-2h1" />
	</svg>
)

export default BathIcon
