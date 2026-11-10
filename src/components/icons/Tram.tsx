import type { IconProps } from '../../types'

const TramIcon = ({ className }: IconProps) => (
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
		<path d="M12 2v4M5 2h14" />
		<path d="M6 6h12v12H6z" />
		<path d="M6 12h12" />
		<path d="M9 15h.01M15 15h.01" />
		<path d="M8 18l-2 4M16 18l2 4" />
	</svg>
)

export default TramIcon
