import type { IconProps } from '../../types'

const PlugZapIcon = ({ className }: IconProps) => (
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
		<path d="M9 2v4M15 2v4" />
		<path d="M6 6h12v4a6 6 0 0 1-12 0z" />
		<path d="M13 9l-2 3h3l-2 3" />
	</svg>
)

export default PlugZapIcon
