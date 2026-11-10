import type { IconProps } from '../../types'

const DonutIcon = ({ className }: IconProps) => (
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
		<path d="M2 11a10 7 0 1 0 20 0 10 7 0 1 0-20 0" />
		<path d="M2 11v3a10 7 0 0 0 20 0v-3" />
		<path d="M8.5 10.5a3.5 2 0 1 0 7 0 3.5 2 0 1 0-7 0" />
		<path d="M6.5 10h.01M17.5 10h.01M9.5 14h.01M14.5 14h.01M12 5.5h.01" />
	</svg>
)

export default DonutIcon
