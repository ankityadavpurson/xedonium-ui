import type { IconProps } from '../../types'

const BugIcon = ({ className }: IconProps) => (
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
		<path d="M8 8h8v9a4 4 0 0 1-8 0z" />
		<path d="M9 8a3 3 0 0 1 6 0" />
		<path d="M12 11v10" />
		<path d="M9 3l1.5 2.5M15 3l-1.5 2.5" />
		<path d="M3 9l5 2M21 9l-5 2M3 15h5M21 15h-5M4 21l4-3M20 21l-4-3" />
	</svg>
)

export default BugIcon
