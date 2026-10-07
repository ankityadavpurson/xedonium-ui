import type { IconProps } from '../../types'

const StarIcon = ({ className }: IconProps) => (
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
		<polygon points="12,2.8 14.53,9.32 21.51,9.71 16.09,14.13 17.88,20.89 12,17.1 6.12,20.89 7.91,14.13 2.49,9.71 9.47,9.32" />
	</svg>
)

export default StarIcon
