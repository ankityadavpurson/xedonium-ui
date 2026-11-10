import type { IconProps } from '../../types'

const UtensilsIcon = ({ className }: IconProps) => (
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
		<path d="M7 2v20" />
		<path d="M4 2v5a3 3 0 0 0 6 0V2" />
		<path d="M19 22V2c-3 0-4 4-4 8 0 2 1 3 4 3" />
	</svg>
)

export default UtensilsIcon
