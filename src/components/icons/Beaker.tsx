import type { IconProps } from '../../types'

const BeakerIcon = ({ className }: IconProps) => (
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
		<path d="M6 2h12" />
		<path d="M7 2v18a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2" />
		<path d="M7 12h10" />
		<path d="M7 7h3M7 17h3" />
	</svg>
)

export default BeakerIcon
