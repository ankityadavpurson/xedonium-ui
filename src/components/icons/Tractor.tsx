import type { IconProps } from '../../types'

const TractorIcon = ({ className }: IconProps) => (
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
		<circle cx="6" cy="16" r="4" />
		<circle cx="19" cy="18" r="2.5" />
		<path d="M10 16h6.5" />
		<path d="M5 12V4h6v6" />
		<path d="M11 10h9v4" />
		<path d="M3 4h10" />
	</svg>
)

export default TractorIcon
