import type { IconProps } from '../../types'

const ThermometerIcon = ({ className }: IconProps) => (
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
		<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
	</svg>
)

export default ThermometerIcon
