import type { IconProps } from '../../types'

const SunsetIcon = ({ className }: IconProps) => (
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
		<path d="M12 2v7" />
		<path d="M9 6l3 3 3-3" />
		<path d="M4.9 10.9l1.4 1.4M19.1 10.9l-1.4 1.4" />
		<path d="M2 18h3M19 18h3" />
		<path d="M7 18a5 5 0 0 1 10 0" />
		<path d="M2 22h20" />
	</svg>
)

export default SunsetIcon
