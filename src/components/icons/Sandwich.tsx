import type { IconProps } from '../../types'

const SandwichIcon = ({ className }: IconProps) => (
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
		<path d="M2.37 11.223l8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777" />
		<path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25" />
		<path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9" />
		<path d="M6.67 15l6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" />
		<rect x="2" y="11" width="20" height="4" />
	</svg>
)

export default SandwichIcon
