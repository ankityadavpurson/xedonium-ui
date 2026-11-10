import type { IconProps } from '../../types'

const FishIcon = ({ className }: IconProps) => (
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
		<path d="M2 12c4-6 10-6 14 0-4 6-10 6-14 0z" />
		<path d="M16 12l5-4v8z" />
		<path d="M6 11h.01" />
	</svg>
)

export default FishIcon
