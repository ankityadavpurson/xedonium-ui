import type { IconProps } from '../../types'

const TestTubesIcon = ({ className }: IconProps) => (
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
		<path d="M3 2h6" />
		<path d="M4 2v17a2 2 0 0 0 4 0V2" />
		<path d="M4 12h4" />
		<path d="M15 2h6" />
		<path d="M16 2v17a2 2 0 0 0 4 0V2" />
		<path d="M16 9h4" />
	</svg>
)

export default TestTubesIcon
