import type { IconProps } from '../../types'

const LeafIcon = ({ className }: IconProps) => (
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
		<path d="M20 4C10 4 4 10 4 20c10 0 16-6 16-16z" />
		<path d="M4 20L14 10" />
	</svg>
)

export default LeafIcon
