import type { IconProps } from '../../types'

const RecycleIcon = ({ className }: IconProps) => (
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
		<g transform="rotate(0 12 12)">
			<path d="M8 5L16 5M13.37 3.56L16 5L13.37 6.44" />
		</g>
		<g transform="rotate(120 12 12)">
			<path d="M8 5L16 5M13.37 3.56L16 5L13.37 6.44" />
		</g>
		<g transform="rotate(240 12 12)">
			<path d="M8 5L16 5M13.37 3.56L16 5L13.37 6.44" />
		</g>
	</svg>
)

export default RecycleIcon
