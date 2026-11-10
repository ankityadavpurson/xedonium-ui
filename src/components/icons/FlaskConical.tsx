import type { IconProps } from '../../types'

const FlaskConicalIcon = ({ className }: IconProps) => (
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
		<path d="M10 2v7l-6 11h16l-6-11V2" />
		<path d="M7 16h10" />
	</svg>
)

export default FlaskConicalIcon
