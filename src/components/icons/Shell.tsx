import type { IconProps } from '../../types'

const ShellIcon = ({ className }: IconProps) => (
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
		<path d="M3 12a3 3 0 0 1 1.72-5.29 3 3 0 0 1 4.5-3.27 3 3 0 0 1 5.56 0 3 3 0 0 1 4.5 3.27A3 3 0 0 1 21 12l-6 9H9z" />
		<path d="M9.2 14L4.72 6.71M10.7 11.5L9.22 3.44M13.3 11.5l1.48-8.06M14.8 14l4.48-7.29" />
	</svg>
)

export default ShellIcon
