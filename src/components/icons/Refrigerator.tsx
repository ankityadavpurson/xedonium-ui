import type { IconProps } from '../../types'

const RefrigeratorIcon = ({ className }: IconProps) => (
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
		<rect x="6" y="2" width="12" height="20" />
		<path d="M6 11h12" />
		<path d="M9 6v2M9 14v3" />
	</svg>
)

export default RefrigeratorIcon
