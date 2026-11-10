import type { IconProps } from '../../types'

const FlaskRoundIcon = ({ className }: IconProps) => (
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
		<path d="M9 2h6" />
		<path d="M10 2v6M14 2v6" />
		<path d="M10 8a6.5 6.5 0 1 0 4 0" />
		<path d="M6 16h12" />
	</svg>
)

export default FlaskRoundIcon
