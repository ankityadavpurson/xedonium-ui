import type { IconProps } from '../../types'

const CakeIcon = ({ className }: IconProps) => (
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
		<path d="M3 21h18" />
		<path d="M4 21V13h16v8" />
		<path d="M4 17c2 2 4 2 6 0s4-2 6 0c1 1 3 1 4 0" />
		<path d="M12 13V9" />
		<path d="M12 3c1 1 1.5 2 0 3-1.5-1-1-2 0-3z" />
	</svg>
)

export default CakeIcon
