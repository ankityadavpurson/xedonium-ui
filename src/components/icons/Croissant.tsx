import type { IconProps } from '../../types'

const CroissantIcon = ({ className }: IconProps) => (
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
		<path d="M9 19c-1.5-5-1-12 3-13 4 1 4.5 8 3 13z" />
		<path d="M9 10C5 9 2 12 2 17c0 1.5 1 2 2.5 2H9" />
		<path d="M15 10c4-1 7 2 7 7 0 1.5-1 2-2.5 2H15" />
	</svg>
)

export default CroissantIcon
