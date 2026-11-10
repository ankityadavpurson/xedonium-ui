import type { IconProps } from '../../types'

const OrbitIcon = ({ className }: IconProps) => (
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
		<path d="M20.34 6.48A10 10 0 0 1 10.27 21.85" />
		<path d="M3.66 17.52A10 10 0 0 1 13.74 2.15" />
		<circle cx="12" cy="12" r="3" />
		<circle cx="19" cy="5" r="2" />
		<circle cx="5" cy="19" r="2" />
	</svg>
)

export default OrbitIcon
