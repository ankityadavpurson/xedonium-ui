import type { IconProps } from '../../types'

const SprayCanIcon = ({ className }: IconProps) => (
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
		<path d="M3 3h.01M7 5h.01M11 7h.01M3 7h.01M7 9h.01M3 11h.01" />
		<rect x="15" y="5" width="4" height="4" />
		<path d="M19 9l2 2v11h-8V11l2-2" />
		<path d="M13 14h8" />
	</svg>
)

export default SprayCanIcon
