import type { IconProps } from '../../types'

const BrushIcon = ({ className }: IconProps) => (
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
		<path d="M11 10l3 3" />
		<path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />
		<path d="M9.969 17.031L21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />
	</svg>
)

export default BrushIcon
