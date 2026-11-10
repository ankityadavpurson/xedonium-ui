import type { IconProps } from '../../types'

const GemIcon = ({ className }: IconProps) => (
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
		<path d="M6 3h12l4 6-10 13L2 9z" />
		<path d="M2 9h20" />
		<path d="M12 22L8 9l4-6 4 6z" />
	</svg>
)

export default GemIcon
