import type { IconProps } from '../../types'

const GraduationCapIcon = ({ className }: IconProps) => (
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
		<path d="M2 9l10-5 10 5-10 5z" />
		<path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
		<path d="M22 9v6" />
	</svg>
)

export default GraduationCapIcon
