import type { IconProps } from '../../types'

const SoupIcon = ({ className }: IconProps) => (
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
		<path d="M3 12h18a9 9 0 0 1-18 0z" />
		<path d="M8 8c0-1.5 1.5-1.5 1.5-3M13 8c0-1.5 1.5-1.5 1.5-3" />
	</svg>
)

export default SoupIcon
