import type { IconProps } from '../../types'

const TrophyIcon = ({ className }: IconProps) => (
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
		<path d="M8 21h8M12 17v4" />
		<path d="M7 4h10v6a5 5 0 0 1-10 0z" />
		<path d="M7 6H4v2a3 3 0 0 0 3 3" />
		<path d="M17 6h3v2a3 3 0 0 1-3 3" />
	</svg>
)

export default TrophyIcon
