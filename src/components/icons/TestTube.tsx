import type { IconProps } from '../../types'

const TestTubeIcon = ({ className }: IconProps) => (
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
		<path d="M8 2h8" />
		<path d="M9 2v17a3 3 0 0 0 6 0V2" />
		<path d="M9 13h6" />
	</svg>
)

export default TestTubeIcon
