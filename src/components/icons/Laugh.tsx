import type { IconProps } from '../../types'

const LaughIcon = ({ className }: IconProps) => (
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
		<circle cx="12" cy="12" r="10" />
		<path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5z" />
		<path d="M9 9h.01M15 9h.01" />
	</svg>
)

export default LaughIcon
