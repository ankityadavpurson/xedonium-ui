import type { IconProps } from '../../types'

const RouterIcon = ({ className }: IconProps) => (
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
		<rect x="3" y="15" width="18" height="6" />
		<path d="M7 18h.01M11 18h.01" />
		<path d="M6 15V9M18 15V9" />
		<path d="M8.5 9a5 5 0 0 1 7 0M10.5 11.5a2 2 0 0 1 3 0M12 13.5h.01" />
	</svg>
)

export default RouterIcon
