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
		<path d="M10 14V4h4v10a4 4 0 1 1-4 0z" />
		<path d="M10 7h2M10 10h2" />
		<circle cx="12" cy="17" r="1" />
	</svg>
)

export default ThermometerIcon
