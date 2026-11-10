import type { IconProps } from '../../types'

const PuzzleIcon = ({ className }: IconProps) => (
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
		<path d="M3 8h5V6a2 2 0 0 1 4 0v2h5v5h2a2 2 0 0 1 0 4h-2v4H3z" />
	</svg>
)

export default PuzzleIcon
