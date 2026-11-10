import type { IconProps } from '../../types'

const CatIcon = ({ className }: IconProps) => (
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
		<path d="M4 3l5 4h6l5-4v10c0 4-3.5 8-8 8s-8-4-8-8z" />
		<path d="M9 12h.01M15 12h.01" />
		<path d="M10.5 15.5h3L12 17z" />
		<path d="M1 12l3 1M1 16l3-1M23 12l-3 1M23 16l-3-1" />
	</svg>
)

export default CatIcon
