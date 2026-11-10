import type { IconProps } from '../../types'

const SaladIcon = ({ className }: IconProps) => (
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
		<path d="M3 12a9 9 0 0 0 18 0z" />
		<path d="M8 12c-1-3 0-5 3-6" />
		<path d="M12 12c0-4 2-6 5-7" />
		<path d="M16 12c2-1 3-2 4-4" />
	</svg>
)

export default SaladIcon
